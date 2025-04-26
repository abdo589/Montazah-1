
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "0504") {
      localStorage.setItem("isLoggedIn", "true");
      toast.success("تم تسجيل الدخول بنجاح");
      navigate("/data");
    } else {
      toast.error("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center py-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/lovable-uploads/e86c45f7-76ea-4e52-9f70-07075333499f.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#f0f4f8",
        direction: "rtl"
      }}
    >
      <Card className="w-full max-w-md bg-white/95 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">تسجيل الدخول</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="اسم المستخدم"
              className="text-right"
              required
            />
          </div>
          <div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              className="text-right"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            تسجيل الدخول
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
