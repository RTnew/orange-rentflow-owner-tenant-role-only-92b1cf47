import { ArrowLeft, User, Mail, Phone, Building2, LogOut, Settings, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { z } from "zod";

const smsSchema = z.object({
  phoneNumber: z.string()
    .trim()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^[0-9+\-\s()]*$/, "Invalid phone number format"),
  message: z.string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(500, "Message must be less than 500 characters")
});

const Profile = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsMessage, setSmsMessage] = useState("Dear Tenant, your rent is due soon. Please make the payment by the due date. Thank you!");

  const handleLogout = () => {
    toast.success("Logged out successfully!");
    navigate("/auth");
  };

  const handleSendSms = () => {
    try {
      // Validate inputs
      const validated = smsSchema.parse({
        phoneNumber: phoneNumber,
        message: smsMessage
      });

      // Clean phone number (remove spaces, dashes, parentheses)
      const cleanNumber = validated.phoneNumber.replace(/[\s\-()]/g, '');
      
      // Encode message for URL
      const encodedMessage = encodeURIComponent(validated.message);
      
      // Open SMS app with pre-filled data
      window.location.href = `sms:${cleanNumber}?body=${encodedMessage}`;
      
      toast.success("Opening SMS app...");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Failed to send SMS");
      }
    }
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

        <div className="glass-card rounded-2xl p-6 shadow-medium space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Send Rent Reminder</h3>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="phone-number" className="text-sm font-medium mb-2 block">
                Tenant Phone Number
              </Label>
              <Input
                id="phone-number"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 234 567 8900"
                className="glass-card"
                maxLength={15}
              />
            </div>

            <div>
              <Label htmlFor="sms-message" className="text-sm font-medium mb-2 block">
                Message
              </Label>
              <Textarea
                id="sms-message"
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                placeholder="Type your reminder message..."
                className="glass-card min-h-[120px] resize-none"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {smsMessage.length}/500 characters
              </p>
            </div>
          </div>

          <Button
            onClick={handleSendSms}
            className="w-full py-5 rounded-xl shadow-medium"
          >
            <Send className="mr-2 h-5 w-5" />
            Send SMS
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
