import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, XCircle, AlertTriangle, Package, Clock, User } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { useToast } from "@/hooks/use-toast";

// Mock data for delivery person
interface AssignedMovement {
  id: string;
  type: "entrega" | "coleta";
  client: string;
  clientAddress: string;
  clientPhone: string;
  description: string;
  quantity: string;
  status: "pendente" | "entregue" | "nao_entregue" | "avariado";
  createdAt: string;
  assignedAt: string;
  justification?: string;
  updatedAt?: string;
}

const mockAssignedMovements: AssignedMovement[] = [
  {
    id: "1",
    type: "entrega" as const,
    client: "Cliente A",
    clientAddress: "Rua das Flores, 123 - Centro",
    clientPhone: "(11) 99999-9999",
    description: "Caixa de documentos importantes",
    quantity: "1 unidade",
    status: "pendente" as const,
    createdAt: "2024-01-15",
    assignedAt: "2024-01-15 10:30"
  },
  {
    id: "2",
    type: "coleta" as const,
    client: "Cliente B",
    clientAddress: "Av. Principal, 456 - Jardins",
    clientPhone: "(11) 88888-8888",
    description: "Equipamentos eletrônicos usados",
    quantity: "3 itens",
    status: "pendente" as const,
    createdAt: "2024-01-14",
    assignedAt: "2024-01-15 09:15"
  }
];

const DeliveryDashboard = () => {
  const [movements, setMovements] = useState<AssignedMovement[]>(mockAssignedMovements);
  const [selectedMovement, setSelectedMovement] = useState<AssignedMovement | null>(null);
  const [justification, setJustification] = useState("");
  const { toast } = useToast();

  const updateMovementStatus = (movementId: string, newStatus: "entregue" | "nao_entregue" | "avariado") => {
    if (!justification.trim()) {
      toast({
        title: "Justificativa obrigatória",
        description: "Por favor, informe uma justificativa para a atualização do status",
        variant: "destructive"
      });
      return;
    }

    setMovements(prev => 
      prev.map(movement => 
        movement.id === movementId 
          ? { ...movement, status: newStatus, justification, updatedAt: new Date().toISOString() }
          : movement
      )
    );

    toast({
      title: "Status atualizado!",
      description: `Movimento marcado como ${newStatus.replace('_', ' ')}`,
    });

    setSelectedMovement(null);
    setJustification("");
  };

  const getStatusActions = (movement: AssignedMovement) => {
    if (movement.status !== "pendente") return null;

    return (
      <div className="flex flex-col gap-2 mt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              className="w-full gap-2 bg-success hover:bg-success/90" 
              onClick={() => setSelectedMovement(movement)}
            >
              <CheckCircle className="w-4 h-4" />
              {movement.type === "entrega" ? "Marcar como Entregue" : "Marcar como Coletado"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar {movement.type === "entrega" ? "Entrega" : "Coleta"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>Descreva os detalhes da {movement.type}:</p>
              <Textarea
                placeholder="Ex: Entrega realizada com sucesso, cliente recebeu em mãos..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button 
                  onClick={() => updateMovementStatus(movement.id, "entregue")}
                  className="flex-1 bg-success hover:bg-success/90"
                >
                  Confirmar
                </Button>
                <Button variant="outline" onClick={() => setJustification("")} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full gap-2 border-danger text-danger hover:bg-danger hover:text-danger-foreground"
              onClick={() => setSelectedMovement(movement)}
            >
              <XCircle className="w-4 h-4" />
              Não {movement.type === "entrega" ? "Entregue" : "Coletado"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{movement.type === "entrega" ? "Entrega" : "Coleta"} Não Realizada</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>Informe o motivo da não realização:</p>
              <Textarea
                placeholder="Ex: Cliente ausente, endereço incorreto, recusa do cliente..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button 
                  onClick={() => updateMovementStatus(movement.id, "nao_entregue")}
                  variant="destructive"
                  className="flex-1"
                >
                  Confirmar
                </Button>
                <Button variant="outline" onClick={() => setJustification("")} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full gap-2 border-warning text-warning hover:bg-warning hover:text-warning-foreground"
              onClick={() => setSelectedMovement(movement)}
            >
              <AlertTriangle className="w-4 h-4" />
              Reportar Avaria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reportar Produto Avariado</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>Descreva o estado da avaria:</p>
              <Textarea
                placeholder="Ex: Caixa danificada, produto molhado, embalagem rasgada..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button 
                  onClick={() => updateMovementStatus(movement.id, "avariado")}
                  className="flex-1 bg-warning hover:bg-warning/90"
                >
                  Confirmar
                </Button>
                <Button variant="outline" onClick={() => setJustification("")} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  const pendingCount = movements.filter(m => m.status === "pendente").length;
  const completedCount = movements.filter(m => m.status === "entregue").length;

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Painel do Entregador</h1>
        <p className="text-muted-foreground">Seus movimentos atribuídos</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-warning/10 to-warning/5">
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold text-warning">{pendingCount}</div>
            <div className="text-sm text-muted-foreground">Pendentes</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-success/10 to-success/5">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold text-success">{completedCount}</div>
            <div className="text-sm text-muted-foreground">Concluídos</div>
          </CardContent>
        </Card>
      </div>

      {/* Movements List */}
      <div className="space-y-4">
        {movements.map(movement => (
          <Card key={movement.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={movement.type === "entrega" ? "default" : "secondary"}>
                      {movement.type === "entrega" ? "ENTREGA" : "COLETA"}
                    </Badge>
                    <StatusBadge status={movement.status} />
                  </div>
                  <CardTitle className="text-lg">{movement.client}</CardTitle>
                </div>
                <Package className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Endereço:</p>
                    <p className="text-muted-foreground">{movement.clientAddress}</p>
                  </div>
                </div>
                
                <div>
                  <p className="font-medium">Telefone: {movement.clientPhone}</p>
                </div>
                
                <div>
                  <p className="font-medium">Produto:</p>
                  <p className="text-muted-foreground">{movement.description}</p>
                </div>
                
                <div>
                  <p className="font-medium">Quantidade: {movement.quantity}</p>
                </div>
                
                <div>
                  <p className="font-medium">Atribuído em:</p>
                  <p className="text-muted-foreground">{movement.assignedAt}</p>
                </div>
              </div>

              {getStatusActions(movement)}

              {movement.status !== "pendente" && movement.justification && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Justificativa:</p>
                  <p className="text-sm text-muted-foreground mt-1">{movement.justification}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {movements.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum movimento atribuído</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;