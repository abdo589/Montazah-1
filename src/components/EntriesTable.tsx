
import React from "react";
import { Eye, EyeOff, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LABELS } from "../constants/labels";
import { type Entry, exportToExcel } from "../utils/storage";
import { toast } from "sonner";

interface EntriesTableProps {
  entries: Entry[];
  isAuthorized: boolean;
  showData: boolean;
  onToggleData: () => void;
  onPasswordSubmit: (password: string) => void;
}

export const EntriesTable = ({
  entries,
  isAuthorized,
  showData,
  onToggleData,
  onPasswordSubmit,
}: EntriesTableProps) => {
  const [password, setPassword] = React.useState("");

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPasswordSubmit(password);
  };

  return (
    <div className="w-full max-w-4xl bg-white/95 rounded-xl shadow-lg px-6 py-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">{LABELS.dataTable}</h3>
        {isAuthorized ? (
          <div className="flex items-center gap-4">
            {entries.length > 0 && (
              <button
                onClick={() => exportToExcel(entries)}
                className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
              >
                <Download size={18} />
                {LABELS.download}
              </button>
            )}
            <button
              onClick={onToggleData}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              {showData ? (
                <>
                  <EyeOff size={18} />
                  إخفاء البيانات
                </>
              ) : (
                <>
                  <Eye size={18} />
                  إظهار البيانات
                </>
              )}
            </button>
          </div>
        ) : (
          <Card className="w-full max-w-md p-4">
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="text-right"
                />
              </div>
              <Button type="submit" className="w-full">
                تسجيل الدخول
              </Button>
            </form>
          </Card>
        )}
      </div>
      
      {isAuthorized && showData ? (
        entries.length > 0 ? (
          <div className="max-h-[400px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">{LABELS.tableNum}</TableHead>
                  <TableHead className="text-right">{LABELS.fullName}</TableHead>
                  <TableHead className="text-right">{LABELS.idNumber}</TableHead>
                  <TableHead className="text-right">{LABELS.phone}</TableHead>
                  <TableHead className="text-right">{LABELS.gender}</TableHead>
                  <TableHead className="text-right">عرض</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry, index) => (
                  <TableRow key={`entry-${index}`}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{entry.fullName}</TableCell>
                    <TableCell>{entry.idNumber}</TableCell>
                    <TableCell>{entry.phone}</TableCell>
                    <TableCell>{entry.gender}</TableCell>
                    <TableCell>
                      <Link 
                        to={`/view/${index + 1}`}
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                      >
                        <Eye size={18} />
                        عرض
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">{LABELS.noData}</div>
        )
      ) : (
        <div className="text-center text-gray-500 py-4">
          {isAuthorized ? "البيانات مخفية" : "يرجى تسجيل الدخول لعرض البيانات"}
        </div>
      )}
    </div>
  );
};
