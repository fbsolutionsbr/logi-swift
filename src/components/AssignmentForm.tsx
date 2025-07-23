import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Movement } from "./MovementForm";
import { DeliveryPerson } from "./DeliveryPersonForm";
import { Package, Truck } from "lucide-react";

interface AssignmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (movementId: string, deliveryPersonId: string) => void;
  movements: Movement[];
  deliveryPersons: DeliveryPerson[];
}

const AssignmentForm = ({ isOpen, onClose, onAssign, movements, deliveryPersons }: AssignmentFormProps) => {
  const [selectedMovement, setSelectedMovement] = useState('');
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState('');
  
  const { toast } = useToast();

  // Filter only pending movements
  const pendingMovements = movements.filter(m => m.status === 'pendente' && !m.deliveryPersonId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMovement || !selectedDeliveryPerson) {
      toast({
        title: "Seleção obrigatória",
        description: "Selecione um movimento e um entregador",
        variant: "destructive"
      });
      return;
    }

    onAssign(selectedMovement, selectedDeliveryPerson);
    
    const movement = movements.find(m => m.id === selectedMovement);
    const deliveryPerson = deliveryPersons.find(d => d.id === selectedDeliveryPerson);
    
    toast({
      title: "Movimento atribuído!",
      description: `${movement?.type} para ${movement?.clientName} atribuída a ${deliveryPerson?.name}`
    });
    
    setSelectedMovement('');
    setSelectedDeliveryPerson('');
    onClose();
  };

  const selectedMovementData = movements.find(m => m.id === selectedMovement);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Atribuir Movimento a Entregador</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Movimento Pendente *</Label>
            <Select value={selectedMovement} onValueChange={setSelectedMovement}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um movimento pendente" />
              </SelectTrigger>
              <SelectContent>
                {pendingMovements.map(movement => (
                  <SelectItem key={movement.id} value={movement.id}>
                    <div className="flex items-center gap-2">
                      {movement.type === 'entrega' ? <Package className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                      <Badge variant={movement.type === 'entrega' ? 'default' : 'secondary'}>
                        {movement.type.toUpperCase()}
                      </Badge>
                      {movement.clientName} - {movement.description}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {pendingMovements.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Nenhum movimento pendente disponível para atribuição
              </p>
            )}
          </div>

          {selectedMovementData && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedMovementData.type === 'entrega' ? 'default' : 'secondary'}>
                      {selectedMovementData.type.toUpperCase()}
                    </Badge>
                    <span className="font-medium">{selectedMovementData.clientName}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Produto:</strong> {selectedMovementData.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Quantidade:</strong> {selectedMovementData.quantity}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div>
            <Label>Entregador *</Label>
            <Select value={selectedDeliveryPerson} onValueChange={setSelectedDeliveryPerson}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um entregador" />
              </SelectTrigger>
              <SelectContent>
                {deliveryPersons.map(person => (
                  <SelectItem key={person.id} value={person.id}>
                    {person.code} - {person.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={pendingMovements.length === 0}
            >
              Atribuir Movimento
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentForm;