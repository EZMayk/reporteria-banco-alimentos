// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold mb-4">Sistema de Gestión de Donaciones</h1>
        <p className="text-xl text-muted-foreground">Plataforma para gestionar donaciones alimentarias</p>
        <div className="mt-8">
          <a 
            href="/reportes" 
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Ver Reportes
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;
