"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LuPlus, LuTrash2, LuCheck, LuX, LuTriangleAlert } from "react-icons/lu";
import Link from "next/link";

interface Task {
  id: number;
  name: string;
  user_id: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export default function TasksPage() {
  const { user, isLoaded } = useUser();
  const supabase = useClerkSupabaseClient();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskName, setNewTaskName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Tasks 로드
  const loadTasks = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setTasks(data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "작업 목록을 불러오는 중 오류가 발생했습니다."
      );
      console.error("Load tasks error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Task 생성
  const createTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !newTaskName.trim() || submitting) return;

    try {
      setSubmitting(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from("tasks")
        .insert({
          name: newTaskName.trim(),
          user_id: user.id, // Clerk user ID 명시적으로 설정
          completed: false,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setTasks((prev) => [data, ...prev]);
      setNewTaskName("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "작업을 생성하는 중 오류가 발생했습니다."
      );
      console.error("Create task error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Task 완료 상태 토글
  const toggleTask = async (taskId: number, currentCompleted: boolean) => {
    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from("tasks")
        .update({ completed: !currentCompleted })
        .eq("id", taskId)
        .select()
        .single();

      if (updateError) throw updateError;

      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? data : task))
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "작업 상태를 업데이트하는 중 오류가 발생했습니다."
      );
      console.error("Toggle task error:", err);
    }
  };

  // Task 삭제
  const deleteTask = async (taskId: number) => {
    if (!confirm("이 작업을 삭제하시겠습니까?")) return;

    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (deleteError) throw deleteError;

      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "작업을 삭제하는 중 오류가 발생했습니다."
      );
      console.error("Delete task error:", err);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      loadTasks();
    }
  }, [user, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <LuTriangleAlert className="w-16 h-16 text-yellow-500" />
        <h1 className="text-2xl font-bold">로그인이 필요합니다</h1>
        <p className="text-gray-600">
          작업 목록을 보려면 먼저 로그인해주세요.
        </p>
        <Link href="/">
          <Button>홈으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <Link
          href="/"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← 홈으로 돌아가기
        </Link>
        <h1 className="text-4xl font-bold mb-2">내 작업 목록</h1>
        <p className="text-gray-600">
          Clerk + Supabase RLS 정책을 사용한 작업 관리 예제입니다.
        </p>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <LuTriangleAlert className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-800">에러</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setError(null)}
            className="text-red-600"
          >
            닫기
          </Button>
        </div>
      )}

      {/* 새 작업 추가 폼 */}
      <div className="mb-8 p-6 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-bold mb-4">새 작업 추가</h2>
        <form onSubmit={createTask} className="flex gap-2">
          <Input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="작업 이름을 입력하세요..."
            className="flex-1"
            disabled={submitting}
          />
          <Button type="submit" disabled={submitting || !newTaskName.trim()}>
            <LuPlus className="w-4 h-4 mr-2" />
            추가
          </Button>
        </form>
      </div>

      {/* 작업 목록 */}
      <div className="border rounded-lg">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">작업 목록</h2>
          <p className="text-sm text-gray-600 mt-1">
            총 {tasks.length}개의 작업
          </p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="py-8 text-center text-gray-500">로딩 중...</div>
          ) : tasks.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p className="mb-2">작업이 없습니다.</p>
              <p className="text-sm">위의 폼을 사용하여 새 작업을 추가하세요.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 border rounded-lg flex items-center gap-4 ${
                    task.completed
                      ? "bg-gray-50 opacity-75"
                      : "bg-white"
                  }`}
                >
                  <button
                    onClick={() => toggleTask(task.id, task.completed)}
                    className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                      task.completed
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 hover:border-green-500"
                    }`}
                    aria-label={task.completed ? "완료 취소" : "완료"}
                  >
                    {task.completed && <LuCheck className="w-4 h-4" />}
                  </button>

                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        task.completed
                          ? "line-through text-gray-500"
                          : "text-gray-900"
                      }`}
                    >
                      {task.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(task.created_at).toLocaleString("ko-KR")}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    aria-label="삭제"
                  >
                    <LuTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 설명 */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-bold mb-2">💡 이 페이지의 작동 원리</h3>
        <ul className="text-sm text-blue-900 space-y-1 list-disc list-inside">
          <li>
            Clerk 세션 토큰이 Supabase 클라이언트에 자동으로 전달됩니다
          </li>
          <li>
            RLS 정책에 따라 각 사용자는 자신의 작업만 조회/생성/수정/삭제할 수
            있습니다
          </li>
          <li>
            <code className="bg-blue-100 px-1 rounded">auth.jwt()-&gt;&gt;'sub'</code>{" "}
            함수가 Clerk user ID를 반환하여 데이터를 필터링합니다
          </li>
          <li>
            다른 사용자로 로그인하면 다른 작업 목록이 표시됩니다 (RLS 활성화
            시)
          </li>
        </ul>
      </div>
    </div>
  );
}




