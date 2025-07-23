import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export interface DeliveryPerson {
  id: string;
  code: string;
  name: string;
  email: string;
  password: string;
}

interface DeliveryPersonFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deliveryPerson: Omit<DeliveryPerson, 'id'>) => void;
  deliveryPerson?: DeliveryPerson;
}

const DeliveryPersonForm = ({ isOpen, onClose, onSave, deliveryPerson }: DeliveryPersonFormProps) => {
  const [formData, setFormData] = useState({
    code: deliveryPerson?.code || '',
    name: deliveryPerson?.name || '',
    email: deliveryPerson?.email || '',
    password: deliveryPerson?.password || ''
  });
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.name || !formData.email || !formData.password) {
      toast({
        title: "Campos obrigatórios",
        description: "Todos os campos são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    toast({
      title: "Entregador salvo!",
      description: deliveryPerson ? "Entregador atualizado com sucesso" : "Novo entregador criado com sucesso"
    });
    
    setFormData({ code: '', name: '', email: '', password: '' });
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{deliveryPerson ? 'Editar Entregador' : 'Novo Entregador'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="code">Código *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                placeholder="Ex: ENT001"
              />
            </div>
            
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nome completo do entregador"
              />
            </div>
            
            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="entregador@email.com"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Senha *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Senha de acesso"
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {deliveryPerson ? 'Atualizar' : 'Criar'} Entregador
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

export default DeliveryPersonForm;