
import React, { useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { LABELS } from "../constants/labels";
import { type Entry } from "../utils/storage";

interface RegistrationFormProps {
  onSubmit: (entry: Entry) => void;
}

export const RegistrationForm = ({ onSubmit }: RegistrationFormProps) => {
  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState(LABELS.male);

  const validate = () => {
    if (!fullName.trim()) return "يرجى إدخال الاسم الكامل";
    if (!/^\d{14}$/.test(idNumber)) return "رقم الهوية يجب أن يكون 14 رقمًا";
    if (!/^\d{11}$/.test(phone)) return "رقم الهاتف يجب أن يكون 11 رقمًا";
    if (gender !== LABELS.male && gender !== LABELS.female)
      return "يرجى تحديد الجنس";
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    onSubmit({ fullName, idNumber, phone, gender });
    setFullName("");
    setIdNumber("");
    setPhone("");
    setGender(LABELS.male);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1">
        <label className="text-gray-700 font-medium">{LABELS.fullName}</label>
        <input
          className="bg-gray-100 px-4 py-3 rounded placeholder:text-gray-400 focus:outline-blue-400"
          type="text"
          placeholder={LABELS.placeholderName}
          value={fullName}
          dir="rtl"
          onChange={e => setFullName(e.target.value)}
          autoComplete="off"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-gray-700 font-medium">{LABELS.idNumber}</label>
        <input
          className="bg-gray-100 px-4 py-3 rounded placeholder:text-gray-400 focus:outline-blue-400"
          type="text"
          placeholder={LABELS.placeholderID}
          value={idNumber}
          inputMode="numeric"
          maxLength={14}
          dir="rtl"
          onChange={e => setIdNumber(e.target.value.replace(/\D/g, ""))}
          autoComplete="off"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-gray-700 font-medium">{LABELS.phone}</label>
        <input
          className="bg-gray-100 px-4 py-3 rounded placeholder:text-gray-400 focus:outline-blue-400"
          type="text"
          placeholder={LABELS.placeholderPhone}
          value={phone}
          inputMode="numeric"
          maxLength={11}
          dir="rtl"
          onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
          autoComplete="off"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-gray-700 font-medium">{LABELS.gender}</label>
        <select
          className="bg-gray-100 px-4 py-3 rounded focus:outline-blue-400"
          value={gender}
          onChange={e => setGender(e.target.value)}
          dir="rtl"
        >
          <option>{LABELS.male}</option>
          <option>{LABELS.female}</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white rounded py-3 mt-1 flex items-center justify-center gap-2 text-lg hover:bg-blue-700 transition"
      >
        <Save size={20} />
        {LABELS.save}
      </button>
    </form>
  );
};

