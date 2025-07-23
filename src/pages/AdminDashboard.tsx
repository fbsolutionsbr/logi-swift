import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Users, Package, Truck, Filter } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import MovementCard from "@/components/MovementCard";

// Mock data
const mockMovements = [
  {
    id: "1",
    type: "entrega" as const,
    client: "Cliente A",
    description: "Caixa de documentos",
    quantity: "1 unidade",
    status: "pendente" as const,
    deliveryPerson: "João Silva",
    createdAt: "2024-01-15"
  },
  {
    id: "2", 
    type: "coleta" as const,
    client: "Cliente B",
    description: "Equipamentos eletrônicos",
    quantity: "3 itens",
    status: "entregue" as const,
    deliveryPerson: "Maria Santos",
    createdAt: "2024-01-14"
  },
  {
    id: "3",
    type: "entrega" as const,
    client: "Cliente C", 
    description: "Medicamentos",
    quantity: "5 caixas",
    status: "avariado" as const,
    deliveryPerson: "Pedro Costa",
    createdAt: "2024-01-13"
  },
  {
    id: "4",
    type: "entrega" as const,
    client: "Cliente D", 
    description: "Produtos farmacêuticos",
    quantity: "2 caixas",
    status: "nao_entregue" as const,
    deliveryPerson: "Ana Lima",
    createdAt: "2024-01-12"
  }
];

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [movements] = useState(mockMovements);

  const filteredMovements = movements.filter(movement => {
    const matchesSearch = movement.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.deliveryPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || movement.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: movements.length,
    pendente: movements.filter(m => m.status === "pendente").length,
    entregue: movements.filter(m => m.status === "entregue").length,
    avariado: movements.filter(m => m.status === "avariado").length,
    naoEntregue: movements.filter(m => m.status === "nao_entregue").length
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Admin</h1>
          <p className="text-muted-foreground">Gerencie entregas e coletas</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Criar Movimento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">{stats.pendente}</div>
            <div className="text-sm text-muted-foreground">Pendentes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{stats.entregue}</div>
            <div className="text-sm text-muted-foreground">Entregues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-danger">{stats.avariado}</div>
            <div className="text-sm text-muted-foreground">Avariados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-danger">{stats.naoEntregue}</div>
            <div className="text-sm text-muted-foreground">Não Entregues</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="movimentos" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="movimentos" className="gap-2">
            <Package className="w-4 h-4" />
            Movimentos
          </TabsTrigger>
          <TabsTrigger value="clientes" className="gap-2">
            <Users className="w-4 h-4" />
            Clientes
          </TabsTrigger>
          <TabsTrigger value="entregadores" className="gap-2">
            <Truck className="w-4 h-4" />
            Entregadores
          </TabsTrigger>
          <TabsTrigger value="atribuir" className="gap-2">
            <Filter className="w-4 h-4" />
            Atribuir
          </TabsTrigger>
        </TabsList>

        <TabsContent value="movimentos" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por cliente ou entregador..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os status</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="entregue">Entregue</SelectItem>
                    <SelectItem value="avariado">Avariado</SelectItem>
                    <SelectItem value="nao_entregue">Não Entregue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Movements List */}
          <div className="space-y-4">
            {filteredMovements.map(movement => (
              <MovementCard key={movement.id} movement={movement} showActions />
            ))}
            {filteredMovements.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum movimento encontrado</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="clientes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Gerenciar Clientes
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Cliente
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Funcionalidade de CRUD de clientes será implementada aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entregadores">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Gerenciar Entregadores
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Entregador
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Funcionalidade de CRUD de entregadores será implementada aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="atribuir">
          <Card>
            <CardHeader>
              <CardTitle>Atribuir Movimentos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Funcionalidade de atribuição de movimentos será implementada aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;