import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Client } from "./ClientForm";

export interface Movement {
  id: string;
  type: "entrega" | "coleta";
  clientId: string;
  clientName: string;
  description: string;
  quantity: string;
  status: "pendente" | "entregue" | "nao_entregue" | "avariado";
  deliveryPersonId?: string;
  deliveryPersonName?: string;
  createdAt: string;
  justification?: string;
}

interface MovementFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (movement: Omit<Movement, 'id' | 'status' | 'createdAt'>) => void;
  clients: Client[];
  movement?: Movement;
}

const MovementForm = ({ isOpen, onClose, onSave, clients, movement }: MovementFormProps) => {
  const [formData, setFormData] = useState({
    type: movement?.type || 'entrega' as 'entrega' | 'coleta',
    clientId: movement?.clientId || '',
    description: movement?.description || '',
    quantity: movement?.quantity || ''
  });
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.clientId || !formData.description || !formData.quantity) {
      toast({
        title: "Campos obrigatórios",
        description: "Todos os campos são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const selectedClient = clients.find(c => c.id === formData.clientId);
    
    onSave({
      ...formData,
      clientName: selectedClient?.name || '',
    });
    
    toast({
      title: "Movimento salvo!",
      description: movement ? "Movimento atualizado com sucesso" : "Novo movimento criado com sucesso"
    });
    
    setFormData({ type: 'entrega', clientId: '', description: '', quantity: '' });
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{movement ? 'Editar Movimento' : 'Novo Movimento'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="type">Tipo *</Label>
              <Select value={formData.type} onValueChange={(value: 'entrega' | 'coleta') => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrega">Entrega</SelectItem>
                  <SelectItem value="coleta">Coleta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="client">Cliente *</Label>
              <Select value={formData.clientId} onValueChange={(value) => handleInputChange('clientId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.code} - {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="description">Descrição do Item *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descreva o que será entregue/coletado"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="quantity">Quantidade *</Label>
              <Input
                id="quantity"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                placeholder="Ex: 2 caixas, 1 unidade, 5 kg"
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {movement ? 'Atualizar' : 'Criar'} Movimento
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

export default MovementForm;