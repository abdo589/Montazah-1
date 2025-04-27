
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EntriesTable } from "@/components/EntriesTable";
import { readFromDatabase } from "@/utils/storage";
import { type Entry } from "@/utils/storage";

const Data = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showData, setShowData] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    
    const loadEntries = async () => {
      const loadedEntries = await readFromDatabase();
      setEntries(loadedEntries);
    };
    
    loadEntries();
  }, [navigate]);

  const handleToggleData = () => {
    setShowData(!showData);
  };

  return (
    <div
      className="min-h-screen py-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/lovable-uploads/e86c45f7-76ea-4e52-9f70-07075333499f.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#f0f4f8",
        direction: "rtl"
      }}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        <EntriesTable
          entries={entries}
          isAuthorized={true}
          showData={showData}
          onToggleData={handleToggleData}
          onPasswordSubmit={() => {}}
        />
      </div>
    </div>
  );
};

export default Data;
