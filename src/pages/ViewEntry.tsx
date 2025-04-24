
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const LABELS = {
  title: "عرض البيانات المسجلة",
  fullName: "الاسم الكامل",
  idNumber: "رقم الهوية",
  phone: "رقم الهاتف",
  gender: "الجنس",
  back: "عودة",
  notFound: "لم يتم العثور على البيانات",
  unauthorized: "غير مصرح بالدخول",
  enterPassword: "الرجاء إدخال كلمة المرور",
  submit: "عرض البيانات",
  wrongPassword: "كلمة المرور غير صحيحة"
};

type Entry = {
  fullName: string;
  idNumber: string;
  phone: string;
  gender: string;
};

const ViewEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = React.useState<Entry | null>(null);
  const [isAuthorized, setIsAuthorized] = React.useState(false);
  const [password, setPassword] = React.useState("");

  React.useEffect(() => {
    const entries = JSON.parse(localStorage.getItem("registration-entries-v1") || "[]");
    const foundEntry = entries[Number(id) - 1];
    if (foundEntry) {
      setEntry(foundEntry);
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password protection - you might want to use a more secure method
    if (password === "admin123") {
      setIsAuthorized(true);
    } else {
      toast.error(LABELS.wrongPassword);
    }
  };

  if (!entry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <p className="text-red-500">{LABELS.notFound}</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <ArrowRight className="rtl:rotate-180" />
              {LABELS.back}
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <h2 className="text-xl font-bold">{LABELS.enterPassword}</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded focus:outline-blue-500"
                dir="rtl"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700"
              >
                {LABELS.submit}
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center border-b">
          <div className="flex items-center justify-center gap-2 text-xl font-bold text-gray-800">
            <Eye size={24} />
            {LABELS.title}
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-4">
            <div className="border-b pb-2">
              <label className="font-medium text-gray-600">{LABELS.fullName}</label>
              <p className="mt-1 text-lg">{entry.fullName}</p>
            </div>
            <div className="border-b pb-2">
              <label className="font-medium text-gray-600">{LABELS.idNumber}</label>
              <p className="mt-1 text-lg">{entry.idNumber}</p>
            </div>
            <div className="border-b pb-2">
              <label className="font-medium text-gray-600">{LABELS.phone}</label>
              <p className="mt-1 text-lg">{entry.phone}</p>
            </div>
            <div className="border-b pb-2">
              <label className="font-medium text-gray-600">{LABELS.gender}</label>
              <p className="mt-1 text-lg">{entry.gender}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="mt-6 flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 w-full"
          >
            <ArrowRight className="rtl:rotate-180" />
            {LABELS.back}
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewEntry;
