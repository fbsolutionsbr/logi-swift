import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Truck, Package, User, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type UserProfile = "admin" | "entregador" | null;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<UserProfile>(null);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !selectedProfile) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos e selecione um perfil",
        variant: "destructive"
      });
      return;
    }

    // Simular login bem-sucedido
    toast({
      title: "Login realizado!",
      description: `Bem-vindo como ${selectedProfile === 'admin' ? 'Administrador' : 'Entregador'}`,
    });

    // Aqui redirecionaria para a tela apropriada
    if (selectedProfile === 'admin') {
      window.location.href = '/admin';
    } else {
      window.location.href = '/entregador';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
            <Package className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">LogiTrack</h1>
            <p className="text-muted-foreground">Sistema de Gestão de Entregas</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Selecione seu perfil:</Label>
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedProfile("admin")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedProfile === "admin"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-primary" />
                    <div className="text-left flex-1">
                      <p className="font-medium">Administrador</p>
                      <p className="text-sm text-muted-foreground">Gerenciar entregas e entregadores</p>
                    </div>
                    {selectedProfile === "admin" && (
                      <Badge variant="default">Selecionado</Badge>
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedProfile("entregador")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedProfile === "entregador"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Truck className="w-5 h-5 text-primary" />
                    <div className="text-left flex-1">
                      <p className="font-medium">Entregador</p>
                      <p className="text-sm text-muted-foreground">Receber e atualizar entregas</p>
                    </div>
                    {selectedProfile === "entregador" && (
                      <Badge variant="default">Selecionado</Badge>
                    )}
                  </div>
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={!email || !password || !selectedProfile}
            >
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;