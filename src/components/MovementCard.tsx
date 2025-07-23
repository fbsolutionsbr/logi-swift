import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, User, Calendar, MoreHorizontal } from "lucide-react";
import StatusBadge, { StatusType } from "./StatusBadge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Movement {
  id: string;
  type: "entrega" | "coleta";
  client: string;
  description: string;
  quantity: string;
  status: StatusType;
  deliveryPerson: string;
  createdAt: string;
  justification?: string;
}

interface MovementCardProps {
  movement: Movement;
  showActions?: boolean;
}

const MovementCard = ({ movement, showActions = false }: MovementCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={movement.type === "entrega" ? "default" : "secondary"}>
                {movement.type === "entrega" ? "ENTREGA" : "COLETA"}
              </Badge>
              <StatusBadge status={movement.status} />
            </div>
            <CardTitle className="text-lg">{movement.client}</CardTitle>
          </div>
          
          <div className="flex items-center gap-2">
            {movement.type === "entrega" ? (
              <Package className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Truck className="w-5 h-5 text-muted-foreground" />
            )}
            
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Editar</DropdownMenuItem>
                  <DropdownMenuItem>Reatribuir</DropdownMenuItem>
                  <DropdownMenuItem className="text-danger">Excluir</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="font-medium">Produto:</p>
            <p className="text-muted-foreground">{movement.description}</p>
          </div>
          
          <div>
            <p className="font-medium">Quantidade:</p>
            <p className="text-muted-foreground">{movement.quantity}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Entregador:</p>
              <p className="text-muted-foreground">{movement.deliveryPerson}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Criado em:</p>
              <p className="text-muted-foreground">{new Date(movement.createdAt).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </div>

        {movement.justification && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">Justificativa:</p>
            <p className="text-sm text-muted-foreground mt-1">{movement.justification}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MovementCard;