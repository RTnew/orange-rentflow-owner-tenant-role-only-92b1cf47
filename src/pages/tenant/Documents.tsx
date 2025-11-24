import { ArrowLeft, FileText, File, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Documents = () => {
  const navigate = useNavigate();

  const documents = [
    { name: "Rental Agreement", type: "PDF", size: "2.4 MB", date: "Jan 1, 2024" },
    { name: "ID Proof", type: "PDF", size: "1.2 MB", date: "Jan 1, 2024" },
    { name: "Utility Bill", type: "PDF", size: "856 KB", date: "Dec 15, 2024" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted pb-20">
      <div className="gradient-primary p-6 text-white rounded-b-[3rem]">
        <button onClick={() => navigate("/tenant/dashboard")} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">My Documents</h1>
        <p className="text-white/80 text-sm mt-1">Access your files anytime</p>
      </div>

      <div className="px-6 mt-6 space-y-3">
        {documents.map((doc, index) => (
          <div key={index} className="glass-card rounded-2xl p-4 shadow-medium hover:shadow-glow transition-all">
            <div className="flex items-center gap-4">
              <div className="glass-card p-3 rounded-xl bg-blue-50">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{doc.name}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{doc.type}</span>
                  <span>•</span>
                  <span>{doc.size}</span>
                  <span>•</span>
                  <span>{doc.date}</span>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => toast.success(`Downloading ${doc.name}...`)}
                className="rounded-full"
              >
                <Download className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documents;
