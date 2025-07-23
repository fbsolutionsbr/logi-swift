import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export interface Client {
  id: string;
  code: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Omit<Client, 'id'>) => void;
  client?: Client;
}

const ClientForm = ({ isOpen, onClose, onSave, client }: ClientFormProps) => {
  const [formData, setFormData] = useState({
    code: client?.code || '',
    name: client?.name || '',
    address: client?.address || '',
    phone: client?.phone || '',
    email: client?.email || ''
  });
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.name) {
      toast({
        title: "Campos obrigatórios",
        description: "Código e nome são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    toast({
      title: "Cliente salvo!",
      description: client ? "Cliente atualizado com sucesso" : "Novo cliente criado com sucesso"
    });
    
    setFormData({ code: '', name: '', address: '', phone: '', email: '' });
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{client ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="code">Código *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                placeholder="Ex: CLI001"
              />
            </div>
            
            <div>
              <Label htmlFor="name">Nome/Razão Social *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nome do cliente"
              />
            </div>
            
            <div>
              <Label htmlFor="address">Endereço</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Endereço completo"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
            
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="cliente@email.com"
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {client ? 'Atualizar' : 'Criar'} Cliente
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

export default ClientForm;