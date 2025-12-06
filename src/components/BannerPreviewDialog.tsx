import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Calendar, Tag } from "lucide-react";

interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  image_url?: string | null;
  location?: string | null;
  page?: string | null;
  roles?: string[] | null;
  created_at: string;
}

interface BannerPreviewDialogProps {
  banner: Banner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BannerPreviewDialog = ({ banner, open, onOpenChange }: BannerPreviewDialogProps) => {
  if (!banner) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto p-0 overflow-hidden rounded-3xl">
        {/* Banner Image */}
        {banner.image_url ? (
          <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5">
            <img 
              src={banner.image_url} 
              alt={banner.title} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <span className="text-8xl">🏢</span>
          </div>
        )}

        <div className="p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold text-foreground">
              {banner.title}
            </DialogTitle>
            {banner.subtitle && (
              <p className="text-lg text-muted-foreground mt-1">{banner.subtitle}</p>
            )}
          </DialogHeader>

          <div className="space-y-3">
            {banner.location && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{banner.location}</span>
              </div>
            )}

            {banner.page && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Tag className="h-5 w-5 text-primary" />
                <span className="capitalize">{banner.page.replace("_", " ")}</span>
              </div>
            )}

            {banner.roles && banner.roles.length > 0 && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="h-5 w-5 text-primary" />
                <div className="flex gap-2">
                  {banner.roles.map((role) => (
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

export default BannerPreviewDialog;
