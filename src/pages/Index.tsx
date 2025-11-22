import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Link2, Settings, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "shortener_config";

const Index = () => {
  const [sheetsUrl, setSheetsUrl] = useState("");
  const [isConfigured, setIsConfigured] = useState(false);
  const [testUrl, setTestUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSheetsUrl(stored);
      setIsConfigured(true);
    }
  }, []);

  const saveConfig = async () => {
    if (!sheetsUrl.trim()) {
      toast.error("Por favor ingresa una URL válida");
      return;
    }

    setLoading(true);
    try {
      // Test the URL
      const response = await fetch(sheetsUrl);
      if (!response.ok) throw new Error("URL no válida");
      
      localStorage.setItem(STORAGE_KEY, sheetsUrl);
      setIsConfigured(true);
      toast.success("Configuración guardada correctamente");
    } catch (error) {
      toast.error("Error al validar la URL. Verifica que sea pública y esté en formato CSV");
    } finally {
      setLoading(false);
    }
  };

  const resetConfig = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSheetsUrl("");
    setIsConfigured(false);
    toast.success("Configuración eliminada");
  };

  const copyExample = () => {
    const example = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSt9v4w47T_7e0nM2iZbElIZmZ3DJNmv_p2fcUmIGGUjjIDmvOuBXFJYFZ_1WwBjq7YyhvSp3yPJ5xX/pub?gid=0&single=true&output=csv";
    navigator.clipboard.writeText(example);
    toast.success("Ejemplo copiado al portapapeles");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Link2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Acortador de Enlaces</h1>
          <p className="text-muted-foreground text-lg">
            Sistema de redirección basado en Google Sheets y GitHub Pages
          </p>
        </div>

        {/* Status Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isConfigured ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Bien Configurado
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-destructive" />
                  Mal Configurado
                </>
              )}
            </CardTitle>
            <CardDescription>
              {isConfigured
                ? "Tu acortador está listo para usarse"
                : "Necesitas configurar la URL de Google Sheets"}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Configuration Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuración
            </CardTitle>
            <CardDescription>
              Ingresa la URL pública de tu Google Sheets en formato CSV
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">URL de Google Sheets (CSV)</label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://docs.google.com/spreadsheets/d/e/..."
                  value={sheetsUrl}
                  onChange={(e) => setSheetsUrl(e.target.value)}
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyExample}
                  title="Copiar ejemplo"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={saveConfig} disabled={loading} className="flex-1">
                {loading ? "Validando..." : "Guardar Configuración"}
              </Button>
              {isConfigured && (
                <Button onClick={resetConfig} variant="outline">
                  Resetear
                </Button>
              )}
            </div>

            <Alert>
              <AlertDescription className="text-sm">
                <strong>Formato requerido:</strong> Tu hoja de cálculo debe tener 2 filas iniciales (título y encabezados), 
                seguidas de las rutas cortas y URLs de destino.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Instrucciones de Uso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Crea tu Google Sheet</h3>
                  <p className="text-sm text-muted-foreground">
                    Crea una hoja con el formato: Primera fila (título), Segunda fila (encabezados: "URL" y "Destino"), 
                    y a partir de la tercera fila tus enlaces cortos y destinos.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Publica como CSV</h3>
                  <p className="text-sm text-muted-foreground">
                    En Google Sheets: Archivo → Compartir → Publicar en la web → Selecciona la hoja → 
                    Formato "Valores separados por comas (.csv)" → Publicar
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Configura el sistema</h3>
                  <p className="text-sm text-muted-foreground">
                    Pega la URL del CSV en el campo de configuración arriba y guárdala.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Despliega en GitHub Pages</h3>
                  <p className="text-sm text-muted-foreground">
                    Sube este proyecto a un repositorio de GitHub y activa GitHub Pages. 
                    Configura tu dominio personalizado (ej: u.gspinar.com) apuntando al sitio.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  5
                </div>
                <div>
                  <h3 className="font-semibold mb-1">¡Usa tus enlaces cortos!</h3>
                  <p className="text-sm text-muted-foreground">
                    Ahora cualquier ruta no existente (ej: tudominio.com/ejemplo) será redirigida 
                    automáticamente según tu hoja de cálculo.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Ejemplo de Google Sheets
              </h4>
              <div className="bg-muted p-3 rounded-md font-mono text-xs overflow-x-auto">
                <div>Acortador de enlaces,</div>
                <div>URL (u.gspinar.com/*),Destino</div>
                <div className="text-primary">/github,https://github.com</div>
                <div className="text-primary">/docs,https://docs.google.com</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
