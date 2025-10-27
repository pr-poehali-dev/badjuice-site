import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  price: number;
  category: 'juice' | 'clothing';
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  { id: 1, name: 'BLOOD ORANGE', price: 350, category: 'juice', image: '🩸' },
  { id: 2, name: 'DARK CHERRY', price: 380, category: 'juice', image: '🍒' },
  { id: 3, name: 'ARCHIVE HOODIE', price: 2500, category: 'clothing', image: '🩸' },
  { id: 4, name: 'GLITCH TEE', price: 1500, category: 'clothing', image: '⚡' },
  { id: 5, name: 'ROTTEN APPLE', price: 320, category: 'juice', image: '🍎' },
  { id: 6, name: 'VOID JACKET', price: 4500, category: 'clothing', image: '🌑' },
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState('shop');
  const [currentTrack, setCurrentTrack] = useState(0);

  const tracks = ['DECAY.mp3', 'GLITCH_MEMORIES.mp3', 'ARCHIVE_001.mp3'];

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-32 blood-drip pointer-events-none z-10"></div>
      
      <header className="relative border-b border-border backdrop-blur-md bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold glitch tracking-wider">
            <span className="text-primary">BAD</span>JUICE
          </h1>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative border-primary hover:bg-primary/20">
                <Icon name="ShoppingCart" size={20} />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {cart.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-card border-l border-border backdrop-blur-xl w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="text-foreground text-xl">КОРЗИНА</SheetTitle>
              </SheetHeader>
              
              <div className="mt-8 space-y-4">
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Корзина пуста</p>
                ) : (
                  <>
                    {cart.map(item => (
                      <Card key={item.id} className="bg-secondary border-border p-4">
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">{item.image}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm">{item.name}</h3>
                            <p className="text-primary font-mono">{item.price} ₽</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 border-border"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Icon name="Minus" size={14} />
                            </Button>
                            <span className="w-8 text-center font-mono">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 border-border"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Icon name="Plus" size={14} />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                    
                    <div className="border-t border-border pt-4 mt-6">
                      <div className="flex justify-between text-lg font-bold mb-6">
                        <span>ИТОГО:</span>
                        <span className="text-primary font-mono">{totalPrice} ₽</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="name" className="text-xs text-muted-foreground">ИМЯ</Label>
                          <Input id="name" placeholder="Введите имя" className="bg-background border-border mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-xs text-muted-foreground">ТЕЛЕФОН</Label>
                          <Input id="phone" placeholder="+7" className="bg-background border-border mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="address" className="text-xs text-muted-foreground">АДРЕС</Label>
                          <Input id="address" placeholder="Адрес доставки" className="bg-background border-border mt-1" />
                        </div>
                        <Button className="w-full bg-primary hover:bg-primary/80 text-white mt-4">
                          ОФОРМИТЬ ЗАКАЗ
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-secondary border border-border mb-8">
            <TabsTrigger value="shop" className="data-[state=active]:bg-primary">
              МАГАЗИН
            </TabsTrigger>
            <TabsTrigger value="music" className="data-[state=active]:bg-primary">
              МУЗЫКА
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shop" className="animate-fade-in">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4 tracking-wider border-b border-primary pb-2">
                  СОКИ
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {products.filter(p => p.category === 'juice').map(product => (
                    <Card
                      key={product.id}
                      className="bg-card border-border overflow-hidden hover:border-primary transition-all hover:shadow-[0_0_20px_rgba(139,0,0,0.3)] group cursor-pointer"
                    >
                      <div className="aspect-square bg-gradient-to-b from-secondary to-background flex items-center justify-center text-8xl backdrop-blur-sm">
                        {product.image}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 tracking-wide">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-primary font-mono text-xl">{product.price} ₽</span>
                          <Button
                            size="sm"
                            onClick={() => addToCart(product)}
                            className="bg-primary hover:bg-primary/80"
                          >
                            <Icon name="Plus" size={16} />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 tracking-wider border-b border-primary pb-2">
                  ОДЕЖДА
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {products.filter(p => p.category === 'clothing').map(product => (
                    <Card
                      key={product.id}
                      className="bg-card border-border overflow-hidden hover:border-primary transition-all hover:shadow-[0_0_20px_rgba(139,0,0,0.3)] group cursor-pointer"
                    >
                      <div className="aspect-square bg-gradient-to-b from-secondary to-background flex items-center justify-center text-8xl backdrop-blur-sm">
                        {product.image}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 tracking-wide">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-primary font-mono text-xl">{product.price} ₽</span>
                          <Button
                            size="sm"
                            onClick={() => addToCart(product)}
                            className="bg-primary hover:bg-primary/80"
                          >
                            <Icon name="Plus" size={16} />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="music" className="animate-fade-in">
            <Card className="max-w-2xl mx-auto bg-card border-border backdrop-blur-xl">
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-center tracking-wider">АРХИВ АУДИО</h2>
                
                <div className="space-y-4 mb-6">
                  {tracks.map((track, index) => (
                    <div
                      key={index}
                      onClick={() => setCurrentTrack(index)}
                      className={`p-4 rounded border cursor-pointer transition-all ${
                        currentTrack === index
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon name={currentTrack === index ? 'Pause' : 'Play'} size={20} className="text-primary" />
                        <span className="font-mono text-sm">{track}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-4 pt-6 border-t border-border">
                  <Button
                    size="icon"
                    variant="outline"
                    className="border-border"
                    onClick={() => setCurrentTrack(Math.max(0, currentTrack - 1))}
                  >
                    <Icon name="SkipBack" size={20} />
                  </Button>
                  <Button
                    size="icon"
                    className="bg-primary hover:bg-primary/80 h-12 w-12"
                  >
                    <Icon name="Play" size={24} />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="border-border"
                    onClick={() => setCurrentTrack(Math.min(tracks.length - 1, currentTrack + 1))}
                  >
                    <Icon name="SkipForward" size={20} />
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border mt-16 py-8 backdrop-blur-md bg-background/80">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm font-mono">
          © 2025 BADJUICE ARCHIVE — ALL RIGHTS CORRUPTED
        </div>
      </footer>
    </div>
  );
}