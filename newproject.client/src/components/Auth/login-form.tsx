import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { useAuthService } from '@/services/authService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";


export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const authService = useAuthService();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Apply blue theme on component mount
  useEffect(() => {
    document.body.classList.remove("light", "dark", "blue");
    document.body.classList.add("blue");
  }, []);

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = sessionStorage.getItem(
      "rememberedEmail",
    );
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call login service
      await authService.login({
        email,
        password
      });

      // Handle remember me functionality
      if (rememberMe) {
        sessionStorage.setItem("rememberedEmail", email);
      } else {
        sessionStorage.removeItem("rememberedEmail");
      }

      // Update auth context
      login();
      
      // Show success message
      toast.success("Login successful!");
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md card-enhanced">
        <CardHeader className="text-center">
          <CardTitle>Welcome to Barbar Shop</CardTitle>
          <CardDescription>
            Sign in to your barbar shop account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 cursor-pointer top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) =>
                  setRememberMe(checked as boolean)
                }
              />
              <Label
                htmlFor="remember-me"
                className="text-sm font-normal cursor-pointer"
              >
                Remember me
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="#"
              className="text-sm cursor-pointer text-primary hover:underline"
              onClick={() => {
                  navigate('register');
              }}
            >
              Forgot your password?
            </a>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Need help accessing your account?</p>
            <p>Contact support at BARBER-1</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}