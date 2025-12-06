import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText } from "lucide-react";

interface Service {
  id: string;
  title: string;
  description?: string | null;
  icon_url?: string | null;
  page?: string | null;
  roles?: string[] | null;
  created_at: string;
}

interface ServicePreviewDialogProps {
  service: Service | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ServicePreviewDialog = ({ service, open, onOpenChange }: ServicePreviewDialogProps) => {
  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto p-0 overflow-hidden rounded-3xl">
        {/* Service Icon */}
        <div className="w-full h-40 bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center">
          {service.icon_url ? (
            <img 
              src={service.icon_url} 
              alt={service.title} 
              className="w-24 h-24 object-contain"
            />
          ) : (
            <FileText className="w-24 h-24 text-white/80" />
          )}
        </div>

        <div className="p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold text-foreground">
              {service.title}
            </DialogTitle>
          </DialogHeader>

          {service.description && (
            <p className="text-muted-foreground mb-4">{service.description}</p>
          )}

          <div className="space-y-3">
            {service.page && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <span className="text-sm font-medium">Page:</span>
                <span className="capitalize">{service.page.replace("_", " ")}</span>
              </div>
            )}

            {service.roles && service.roles.length > 0 && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <span className="text-sm font-medium">Available for:</span>
                <div className="flex gap-2">
                  {service.roles.map((role) => (
                    <span 
                      key={role} 
                      className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full capitalize"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServicePreviewDialog;
