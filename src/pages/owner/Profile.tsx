import { ArrowLeft, User, Mail, Phone, Building2, LogOut, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const [autoSmsEnabled, setAutoSmsEnabled] = useState(false);
  const [daysBeforeDue, setDaysBeforeDue] = useState("3");

  const handleLogout = () => {
    toast.success("Logged out successfully!");
    navigate("/auth");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification settings saved!");
    // TODO: Save to backend when Cloud is connected
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted pb-20">
      <div className="gradient-primary p-6 text-white rounded-b-[3rem]">
        <button onClick={() => navigate("/owner/dashboard")} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-4">
          <div className="glass-card p-4 rounded-full">
            <User className="h-12 w-12" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Owner Profile</h1>
            <p className="text-white/80 text-sm mt-1">Manage your account</p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-4">
        <div className="glass-card rounded-2xl p-6 shadow-medium space-y-4">
          <h3 className="font-semibold mb-3">Personal Information</h3>
          
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
            <User className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Full Name</p>
              <p className="font-medium">John Doe</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium">john.doe@email.com</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
            <Phone className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="font-medium">+1 234 567 8900</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
            <Building2 className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Properties</p>
              <p className="font-medium">3 Properties</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 shadow-medium space-y-5">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Automatic Rent Reminders</h3>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
            <div className="flex-1">
              <Label htmlFor="auto-sms" className="font-medium">
                Send SMS Notifications
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Automatically remind tenants via SMS
              </p>
            </div>
            <Switch
              id="auto-sms"
              checked={autoSmsEnabled}
              onCheckedChange={setAutoSmsEnabled}
            />
          </div>

          {autoSmsEnabled && (
            <div className="p-4 rounded-xl bg-muted/30 space-y-3">
              <Label htmlFor="days-before" className="text-sm font-medium">
                Send reminder (days before due date)
              </Label>
              <Input
                id="days-before"
                type="number"
                min="1"
                max="30"
                value={daysBeforeDue}
                onChange={(e) => setDaysBeforeDue(e.target.value)}
                className="glass-card"
                placeholder="Enter days"
              />
              <p className="text-xs text-muted-foreground">
                SMS will be sent {daysBeforeDue} day{daysBeforeDue !== "1" ? "s" : ""} before rent is due
              </p>
            </div>
          )}

          <Button
            onClick={handleSaveNotifications}
            className="w-full py-5 rounded-xl shadow-medium"
          >
            Save Notification Settings
          </Button>
        </div>

        <div className="glass-card rounded-2xl p-4 shadow-medium">
          <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
            <Settings className="h-5 w-5 text-primary" />
            <span className="font-medium">Account Settings</span>
          </button>
        </div>

        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full py-6 rounded-xl shadow-medium"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Profile;
