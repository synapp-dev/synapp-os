import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Page() {
  const supabase = await createClient(cookies());

  const { data: todos } = await supabase.from("todos").select();

  return (
    <ul>
      {todos?.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
