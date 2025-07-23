import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, AlertTriangle } from "lucide-react";

export type StatusType = "pendente" | "entregue" | "nao_entregue" | "avariado";

interface StatusBadgeProps {
  status: StatusType;
  size?: "sm" | "default";
}

const StatusBadge = ({ status, size = "default" }: StatusBadgeProps) => {
  const configs = {
    pendente: {
      icon: Clock,
      label: "Pendente",
      className: "bg-warning/10 text-warning hover:bg-warning/20 border-warning/20"
    },
    entregue: {
      icon: CheckCircle,
      label: "Entregue",
      className: "bg-success/10 text-success hover:bg-success/20 border-success/20"
    },
    nao_entregue: {
      icon: XCircle,
      label: "Não Entregue",
      className: "bg-danger/10 text-danger hover:bg-danger/20 border-danger/20"
    },
    avariado: {
      icon: AlertTriangle,
      label: "Avariado",
      className: "bg-warning/10 text-warning hover:bg-warning/20 border-warning/20"
    }
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={`gap-1 ${config.className}`}
    >
      <Icon className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"}`} />
      {config.label}
    </Badge>
  );
};

export default StatusBadge;