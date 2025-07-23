import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Users, Package, Truck, Filter, Edit, Trash2 } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import MovementCard from "@/components/MovementCard";
import ClientForm, { Client } from "@/components/ClientForm";
import DeliveryPersonForm, { DeliveryPerson } from "@/components/DeliveryPersonForm";
import MovementForm, { Movement } from "@/components/MovementForm";
import AssignmentForm from "@/components/AssignmentForm";
import { useToast } from "@/hooks/use-toast";

// Mock data with more robust structure
const initialClients: Client[] = [
  {
    id: "1",
    code: "CLI001",
    name: "Empresa ABC Ltda",
    address: "Rua das Flores, 123 - Centro, São Paulo - SP",
    phone: "(11) 99999-9999",
    email: "contato@empresaabc.com"
  },
  {
    id: "2",
    code: "CLI002", 
    name: "Comércio XYZ",
    address: "Av. Principal, 456 - Jardins, São Paulo - SP",
    phone: "(11) 88888-8888",
    email: "vendas@comercioxyz.com"
  },
  {
    id: "3",
    code: "CLI003",
    name: "Indústria 123",
    address: "Rua Industrial, 789 - Vila Madalena, São Paulo - SP", 
    phone: "(11) 77777-7777",
    email: "logistica@industria123.com"
  }
];

const initialDeliveryPersons: DeliveryPerson[] = [
  {
    id: "1",
    code: "ENT001",
    name: "João Silva",
    email: "joao.silva@email.com",
    password: "123456"
  },
  {
    id: "2",
    code: "ENT002", 
    name: "Maria Santos",
    email: "maria.santos@email.com",
    password: "123456"
  },
  {
    id: "3",
    code: "ENT003",
    name: "Pedro Costa",
    email: "pedro.costa@email.com",
    password: "123456"
  },
  {
    id: "4",
    code: "ENT004",
    name: "Ana Lima",
    email: "ana.lima@email.com", 
    password: "123456"
  }
];

const initialMovements: Movement[] = [
  {
    id: "1",
    type: "entrega",
    clientId: "1",
    clientName: "Empresa ABC Ltda",
    description: "Caixa de documentos importantes",
    quantity: "1 unidade",
    status: "pendente",
    deliveryPersonId: "1",
    deliveryPersonName: "João Silva",
    createdAt: "2024-01-15"
  },
  {
    id: "2", 
    type: "coleta",
    clientId: "2",
    clientName: "Comércio XYZ",
    description: "Equipamentos eletrônicos usados",
    quantity: "3 itens",
    status: "entregue",
    deliveryPersonId: "2",
    deliveryPersonName: "Maria Santos",
    createdAt: "2024-01-14"
  },
  {
    id: "3",
    type: "entrega",
    clientId: "3",
    clientName: "Indústria 123", 
    description: "Medicamentos controlados",
    quantity: "5 caixas",
    status: "avariado",
    deliveryPersonId: "3",
    deliveryPersonName: "Pedro Costa",
    createdAt: "2024-01-13"
  },
  {
    id: "4",
    type: "entrega",
    clientId: "1",
    clientName: "Empresa ABC Ltda", 
    description: "Produtos farmacêuticos",
    quantity: "2 caixas",
    status: "nao_entregue",
    deliveryPersonId: "4",
    deliveryPersonName: "Ana Lima",
    createdAt: "2024-01-12"
  }
];

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [activeTab, setActiveTab] = useState("movimentos");
  
  // State for data
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [deliveryPersons, setDeliveryPersons] = useState<DeliveryPerson[]>(initialDeliveryPersons);
  const [movements, setMovements] = useState<Movement[]>(initialMovements);
  
  // State for forms
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [isDeliveryPersonFormOpen, setIsDeliveryPersonFormOpen] = useState(false);
  const [isMovementFormOpen, setIsMovementFormOpen] = useState(false);
  const [isAssignmentFormOpen, setIsAssignmentFormOpen] = useState(false);
  
  const [editingClient, setEditingClient] = useState<Client | undefined>();
  const [editingDeliveryPerson, setEditingDeliveryPerson] = useState<DeliveryPerson | undefined>();
  const [editingMovement, setEditingMovement] = useState<Movement | undefined>();

  const { toast } = useToast();

  // Filter functions
  const filteredMovements = movements.filter(movement => {
    const matchesSearch = movement.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (movement.deliveryPersonName && movement.deliveryPersonName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "todos" || movement.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDeliveryPersons = deliveryPersons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // CRUD functions for clients
  const handleSaveClient = (clientData: Omit<Client, 'id'>) => {
    if (editingClient) {
      setClients(prev => prev.map(c => c.id === editingClient.id ? { ...clientData, id: editingClient.id } : c));
      setEditingClient(undefined);
    } else {
      const newClient: Client = {
        ...clientData,
        id: Date.now().toString()
      };
      setClients(prev => [...prev, newClient]);
    }
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsClientFormOpen(true);
  };

  const handleDeleteClient = (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
    toast({
      title: "Cliente excluído",
      description: "Cliente removido com sucesso"
    });
  };

  // CRUD functions for delivery persons
  const handleSaveDeliveryPerson = (personData: Omit<DeliveryPerson, 'id'>) => {
    if (editingDeliveryPerson) {
      setDeliveryPersons(prev => prev.map(p => p.id === editingDeliveryPerson.id ? { ...personData, id: editingDeliveryPerson.id } : p));
      setEditingDeliveryPerson(undefined);
    } else {
      const newPerson: DeliveryPerson = {
        ...personData,
        id: Date.now().toString()
      };
      setDeliveryPersons(prev => [...prev, newPerson]);
    }
  };

  const handleEditDeliveryPerson = (person: DeliveryPerson) => {
    setEditingDeliveryPerson(person);
    setIsDeliveryPersonFormOpen(true);
  };

  const handleDeleteDeliveryPerson = (personId: string) => {
    setDeliveryPersons(prev => prev.filter(p => p.id !== personId));
    toast({
      title: "Entregador excluído",
      description: "Entregador removido com sucesso"
    });
  };

  // CRUD functions for movements
  const handleSaveMovement = (movementData: Omit<Movement, 'id' | 'status' | 'createdAt'>) => {
    if (editingMovement) {
      setMovements(prev => prev.map(m => m.id === editingMovement.id ? { 
        ...movementData, 
        id: editingMovement.id, 
        status: editingMovement.status,
        createdAt: editingMovement.createdAt,
        deliveryPersonId: editingMovement.deliveryPersonId,
        deliveryPersonName: editingMovement.deliveryPersonName
      } : m));
      setEditingMovement(undefined);
    } else {
      const newMovement: Movement = {
        ...movementData,
        id: Date.now().toString(),
        status: "pendente",
        createdAt: new Date().toISOString().split('T')[0]
      };
      setMovements(prev => [...prev, newMovement]);
    }
  };

  const handleEditMovement = (movement: Movement) => {
    setEditingMovement(movement);
    setIsMovementFormOpen(true);
  };

  const handleDeleteMovement = (movementId: string) => {
    setMovements(prev => prev.filter(m => m.id !== movementId));
    toast({
      title: "Movimento excluído",
      description: "Movimento removido com sucesso"
    });
  };

  // Assignment function
  const handleAssignMovement = (movementId: string, deliveryPersonId: string) => {
    const deliveryPerson = deliveryPersons.find(p => p.id === deliveryPersonId);
    setMovements(prev => prev.map(m => 
      m.id === movementId 
        ? { ...m, deliveryPersonId, deliveryPersonName: deliveryPerson?.name }
        : m
    ));
  };

  // Stats calculation
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
        <Button className="gap-2" onClick={() => setIsMovementFormOpen(true)}>
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
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
              <Card key={movement.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={movement.type === "entrega" ? "default" : "secondary"}>
                          {movement.type === "entrega" ? "ENTREGA" : "COLETA"}
                        </Badge>
                        <StatusBadge status={movement.status} />
                      </div>
                      <CardTitle className="text-lg">{movement.clientName}</CardTitle>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditMovement(movement)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteMovement(movement.id)}
                        className="text-danger hover:text-danger"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
                    
                    <div>
                      <p className="font-medium">Entregador:</p>
                      <p className="text-muted-foreground">{movement.deliveryPersonName || "Não atribuído"}</p>
                    </div>
                    
                    <div>
                      <p className="font-medium">Criado em:</p>
                      <p className="text-muted-foreground">{new Date(movement.createdAt).toLocaleDateString('pt-BR')}</p>
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

        <TabsContent value="clientes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gerenciar Clientes ({clients.length})</CardTitle>
                <Button onClick={() => setIsClientFormOpen(true)} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Cliente
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredClients.map(client => (
                  <Card key={client.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{client.code}</Badge>
                            <h3 className="font-semibold">{client.name}</h3>
                          </div>
                          {client.address && (
                            <p className="text-sm text-muted-foreground">{client.address}</p>
                          )}
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            {client.phone && <span>{client.phone}</span>}
                            {client.email && <span>{client.email}</span>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditClient(client)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteClient(client.id)}
                            className="text-danger hover:text-danger"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entregadores" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gerenciar Entregadores ({deliveryPersons.length})</CardTitle>
                <Button onClick={() => setIsDeliveryPersonFormOpen(true)} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Entregador
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar entregador..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredDeliveryPersons.map(person => (
                  <Card key={person.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{person.code}</Badge>
                            <h3 className="font-semibold">{person.name}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{person.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditDeliveryPerson(person)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteDeliveryPerson(person.id)}
                            className="text-danger hover:text-danger"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="atribuir" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Atribuir Movimentos</CardTitle>
                <Button onClick={() => setIsAssignmentFormOpen(true)} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Atribuição
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-warning">
                        {movements.filter(m => m.status === 'pendente' && !m.deliveryPersonId).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Movimentos Não Atribuídos</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary">
                        {deliveryPersons.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Entregadores Disponíveis</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Movimentos Pendentes</h4>
                  {movements.filter(m => m.status === 'pendente' && !m.deliveryPersonId).map(movement => (
                    <Card key={movement.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant={movement.type === 'entrega' ? 'default' : 'secondary'}>
                              {movement.type.toUpperCase()}
                            </Badge>
                            <span className="font-medium">{movement.clientName}</span>
                            <span className="text-muted-foreground">- {movement.description}</span>
                          </div>
                          <StatusBadge status={movement.status} size="sm" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {movements.filter(m => m.status === 'pendente' && !m.deliveryPersonId).length === 0 && (
                    <p className="text-muted-foreground text-center py-8">
                      Todos os movimentos pendentes já foram atribuídos
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Forms */}
      <ClientForm
        isOpen={isClientFormOpen}
        onClose={() => {
          setIsClientFormOpen(false);
          setEditingClient(undefined);
        }}
        onSave={handleSaveClient}
        client={editingClient}
      />

      <DeliveryPersonForm
        isOpen={isDeliveryPersonFormOpen}
        onClose={() => {
          setIsDeliveryPersonFormOpen(false);
          setEditingDeliveryPerson(undefined);
        }}
        onSave={handleSaveDeliveryPerson}
        deliveryPerson={editingDeliveryPerson}
      />

      <MovementForm
        isOpen={isMovementFormOpen}
        onClose={() => {
          setIsMovementFormOpen(false);
          setEditingMovement(undefined);
        }}
        onSave={handleSaveMovement}
        clients={clients}
        movement={editingMovement}
      />

      <AssignmentForm
        isOpen={isAssignmentFormOpen}
        onClose={() => setIsAssignmentFormOpen(false)}
        onAssign={handleAssignMovement}
        movements={movements}
        deliveryPersons={deliveryPersons}
      />
    </div>
  );
};

export default AdminDashboard;