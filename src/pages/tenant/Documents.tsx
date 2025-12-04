import { ArrowLeft, FileText, Download, Upload, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Documents = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["tenant-documents", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) throw new Error("Not authenticated");
      
      const { error } = await supabase.from("documents").insert({
        user_id: user.id,
        name: file.name,
        file_type: file.type.split("/")[1]?.toUpperCase() || "FILE",
        file_size: formatFileSize(file.size),
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-documents"] });
      toast.success("Document uploaded successfully");
    },
    onError: () => {
      toast.error("Failed to upload document");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (docId: string) => {
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", docId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-documents"] });
      toast.success("Document deleted");
    },
    onError: () => {
      toast.error("Failed to delete document");
    },
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => uploadMutation.mutate(file));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted pb-20">
      <div className="gradient-primary p-6 text-white rounded-b-[3rem]">
        <button onClick={() => navigate("/tenant/dashboard")} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">My Documents</h1>
        <p className="text-white/80 text-sm mt-1">Access your files anytime</p>
      </div>

      <div className="px-6 mt-6 space-y-4">
        <div className="glass-card rounded-2xl p-4 border-2 border-dashed border-border">
          <input
            type="file"
            id="doc-upload"
            accept=".pdf,.doc,.docx,.jpg,.png"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <label htmlFor="doc-upload" className="flex items-center justify-center gap-3 cursor-pointer">
            <Upload className="h-5 w-5 text-primary" />
            <span className="font-medium">Upload Documents</span>
          </label>
        </div>

        {documents.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No documents uploaded yet</p>
          </div>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="glass-card rounded-2xl p-4 shadow-medium hover:shadow-glow transition-all">
              <div className="flex items-center gap-4">
                <div className="glass-card p-3 rounded-xl bg-blue-50">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{doc.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{doc.file_type}</span>
                    <span>•</span>
                    <span>{doc.file_size}</span>
                    <span>•</span>
                    <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteMutation.mutate(doc.id)}
                  className="rounded-full text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Documents;
