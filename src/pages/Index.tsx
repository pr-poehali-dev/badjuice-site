import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Review {
  id: number;
  productId: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: 'juice' | 'clothing';
  image: string;
  rating?: number;
  reviewCount?: number;
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

interface Track {
  name: string;
  url: string;
}

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState('shop');
  const [currentTrack, setCurrentTrack] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([
    { id: 1, productId: 1, author: 'GHOST_USER', rating: 5, comment: 'Вкус как из потусторонного мира. Рекомендую.', date: '2025-10-20' },
    { id: 2, productId: 1, author: 'VOID_WALKER', rating: 4, comment: 'Хороший сок, но мало крови.', date: '2025-10-18' },
    { id: 3, productId: 3, author: 'ARCHIVE_X', rating: 5, comment: 'Худи топ, качество отличное. Глитч-эффект как надо.', date: '2025-10-15' },
  ]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newReview, setNewReview] = useState({ author: '', rating: 5, comment: '' });
  const [filterCategory, setFilterCategory] = useState<'all' | 'juice' | 'clothing'>('all');
  const [filterRating, setFilterRating] = useState<string>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const tracks: Track[] = [
    { name: 'BLOOD_DRIP.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { name: 'DECAY.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { name: 'GLITCH_MEMORIES.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    { name: 'ARCHIVE_001.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
    { name: 'VOID_WALKER.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
    { name: 'CORRUPTED_DATA.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
    { name: 'DARK_CHERRY_DREAMS.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
    { name: 'ROTTEN_ECHOES.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
    { name: 'GHOST_PROTOCOL.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
    { name: 'BADJUICE_ANTHEM.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
  ];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      if (currentTrack < tracks.length - 1) {
        setCurrentTrack(currentTrack + 1);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, tracks.length]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = tracks[currentTrack].url;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrack, tracks]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTrackSelect = (index: number) => {
    setCurrentTrack(index);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    const newIndex = Math.max(0, currentTrack - 1);
    setCurrentTrack(newIndex);
    setIsPlaying(true);
  };

  const handleNextTrack = () => {
    const newIndex = Math.min(tracks.length - 1, currentTrack + 1);
    setCurrentTrack(newIndex);
    setIsPlaying(true);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProductReviews = (productId: number) => {
    return reviews.filter(review => review.productId === productId);
  };

  const getAverageRating = (productId: number) => {
    const productReviews = getProductReviews(productId);
    if (productReviews.length === 0) return 0;
    const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / productReviews.length).toFixed(1);
  };

  const handleSubmitReview = () => {
    if (!selectedProduct || !newReview.author || !newReview.comment) return;
    
    const review: Review = {
      id: Date.now(),
      productId: selectedProduct.id,
      author: newReview.author,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0]
    };
    
    setReviews([...reviews, review]);
    setNewReview({ author: '', rating: 5, comment: '' });
  };

  const renderStars = (rating: number, interactive: boolean = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name="Star"
            size={16}
            className={`${
              star <= rating ? 'text-primary fill-primary' : 'text-muted-foreground'
            } ${interactive ? 'cursor-pointer hover:text-primary' : ''}`}
            onClick={() => interactive && onRate?.(star)}
          />
        ))}
      </div>
    );
  };

  const getFilteredProducts = () => {
    let filtered = products;

    if (filterCategory !== 'all') {
      filtered = filtered.filter(p => p.category === filterCategory);
    }

    if (filterRating !== 'all') {
      const minRating = parseFloat(filterRating);
      filtered = filtered.filter(p => {
        const avgRating = parseFloat(getAverageRating(p.id));
        return avgRating >= minRating;
      });
    }

    return filtered;
  };

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
            <div className="flex flex-wrap gap-4 mb-8 items-center justify-center">
              <div className="flex items-center gap-2">
                <Icon name="Filter" size={20} className="text-primary" />
                <span className="text-sm font-mono text-muted-foreground">ФИЛЬТРЫ:</span>
              </div>
              <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v as 'all' | 'juice' | 'clothing')}>
                <SelectTrigger className="w-[180px] bg-secondary border-border">
                  <SelectValue placeholder="Категория" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">Все товары</SelectItem>
                  <SelectItem value="juice">Соки</SelectItem>
                  <SelectItem value="clothing">Одежда</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-[180px] bg-secondary border-border">
                  <SelectValue placeholder="Рейтинг" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">Любой рейтинг</SelectItem>
                  <SelectItem value="4">⭐ 4+ звезды</SelectItem>
                  <SelectItem value="3">⭐ 3+ звезды</SelectItem>
                  <SelectItem value="2">⭐ 2+ звезды</SelectItem>
                </SelectContent>
              </Select>
              {(filterCategory !== 'all' || filterRating !== 'all') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilterCategory('all');
                    setFilterRating('all');
                  }}
                  className="border-primary text-primary hover:bg-primary/20"
                >
                  Сбросить
                </Button>
              )}
            </div>
            <div className="space-y-8">
              {filterCategory === 'all' && (
                <>
                  <div>
                    <h2 className="text-2xl font-bold mb-4 tracking-wider border-b border-primary pb-2">
                      СОКИ
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {getFilteredProducts().filter(p => p.category === 'juice').map(product => (
                    <Card
                      key={product.id}
                      className="bg-card border-border overflow-hidden hover:border-primary transition-all hover:shadow-[0_0_20px_rgba(139,0,0,0.3)] group"
                    >
                      <div className="aspect-square bg-gradient-to-b from-secondary to-background flex items-center justify-center text-8xl backdrop-blur-sm">
                        {product.image}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 tracking-wide">{product.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(Number(getAverageRating(product.id)))}
                          <span className="text-xs text-muted-foreground font-mono">
                            ({getProductReviews(product.id).length})
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-primary font-mono text-xl">{product.price} ₽</span>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedProduct(product)}
                                  className="border-border"
                                >
                                  <Icon name="MessageSquare" size={16} />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-card border-border max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="text-foreground text-xl tracking-wider">
                                    {product.name} — ОТЗЫВЫ
                                  </DialogTitle>
                                </DialogHeader>
                                <ScrollArea className="h-[400px] pr-4">
                                  <div className="space-y-4">
                                    {getProductReviews(product.id).length === 0 ? (
                                      <p className="text-muted-foreground text-center py-8">Отзывов пока нет</p>
                                    ) : (
                                      getProductReviews(product.id).map((review) => (
                                        <Card key={review.id} className="bg-secondary border-border p-4">
                                          <div className="flex items-start justify-between mb-2">
                                            <div>
                                              <p className="font-bold text-sm font-mono">{review.author}</p>
                                              <p className="text-xs text-muted-foreground">{review.date}</p>
                                            </div>
                                            {renderStars(review.rating)}
                                          </div>
                                          <p className="text-sm">{review.comment}</p>
                                        </Card>
                                      ))
                                    )}
                                  </div>
                                </ScrollArea>
                                <div className="border-t border-border pt-4 space-y-3">
                                  <h3 className="font-bold text-sm tracking-wider">ОСТАВИТЬ ОТЗЫВ</h3>
                                  <div>
                                    <Label htmlFor="review-author" className="text-xs text-muted-foreground">ИМЯ</Label>
                                    <Input
                                      id="review-author"
                                      placeholder="Ваше имя"
                                      value={newReview.author}
                                      onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                                      className="bg-background border-border mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs text-muted-foreground">ОЦЕНКА</Label>
                                    <div className="mt-2">
                                      {renderStars(newReview.rating, true, (rating) => setNewReview({ ...newReview, rating }))}
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="review-comment" className="text-xs text-muted-foreground">КОММЕНТАРИЙ</Label>
                                    <Textarea
                                      id="review-comment"
                                      placeholder="Ваш отзыв..."
                                      value={newReview.comment}
                                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                      className="bg-background border-border mt-1 min-h-[80px]"
                                    />
                                  </div>
                                  <Button 
                                    className="w-full bg-primary hover:bg-primary/80"
                                    onClick={handleSubmitReview}
                                  >
                                    ОТПРАВИТЬ ОТЗЫВ
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              size="sm"
                              onClick={() => addToCart(product)}
                              className="bg-primary hover:bg-primary/80"
                            >
                              <Icon name="Plus" size={16} />
                            </Button>
                          </div>
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
                      {getFilteredProducts().filter(p => p.category === 'clothing').map(product => (
                    <Card
                      key={product.id}
                      className="bg-card border-border overflow-hidden hover:border-primary transition-all hover:shadow-[0_0_20px_rgba(139,0,0,0.3)] group"
                    >
                      <div className="aspect-square bg-gradient-to-b from-secondary to-background flex items-center justify-center text-8xl backdrop-blur-sm">
                        {product.image}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 tracking-wide">{product.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(Number(getAverageRating(product.id)))}
                          <span className="text-xs text-muted-foreground font-mono">
                            ({getProductReviews(product.id).length})
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-primary font-mono text-xl">{product.price} ₽</span>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedProduct(product)}
                                  className="border-border"
                                >
                                  <Icon name="MessageSquare" size={16} />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-card border-border max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="text-foreground text-xl tracking-wider">
                                    {product.name} — ОТЗЫВЫ
                                  </DialogTitle>
                                </DialogHeader>
                                <ScrollArea className="h-[400px] pr-4">
                                  <div className="space-y-4">
                                    {getProductReviews(product.id).length === 0 ? (
                                      <p className="text-muted-foreground text-center py-8">Отзывов пока нет</p>
                                    ) : (
                                      getProductReviews(product.id).map((review) => (
                                        <Card key={review.id} className="bg-secondary border-border p-4">
                                          <div className="flex items-start justify-between mb-2">
                                            <div>
                                              <p className="font-bold text-sm font-mono">{review.author}</p>
                                              <p className="text-xs text-muted-foreground">{review.date}</p>
                                            </div>
                                            {renderStars(review.rating)}
                                          </div>
                                          <p className="text-sm">{review.comment}</p>
                                        </Card>
                                      ))
                                    )}
                                  </div>
                                </ScrollArea>
                                <div className="border-t border-border pt-4 space-y-3">
                                  <h3 className="font-bold text-sm tracking-wider">ОСТАВИТЬ ОТЗЫВ</h3>
                                  <div>
                                    <Label htmlFor="clothing-review-author" className="text-xs text-muted-foreground">ИМЯ</Label>
                                    <Input
                                      id="clothing-review-author"
                                      placeholder="Ваше имя"
                                      value={newReview.author}
                                      onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                                      className="bg-background border-border mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs text-muted-foreground">ОЦЕНКА</Label>
                                    <div className="mt-2">
                                      {renderStars(newReview.rating, true, (rating) => setNewReview({ ...newReview, rating }))}
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="clothing-review-comment" className="text-xs text-muted-foreground">КОММЕНТАРИЙ</Label>
                                    <Textarea
                                      id="clothing-review-comment"
                                      placeholder="Ваш отзыв..."
                                      value={newReview.comment}
                                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                      className="bg-background border-border mt-1 min-h-[80px]"
                                    />
                                  </div>
                                  <Button 
                                    className="w-full bg-primary hover:bg-primary/80"
                                    onClick={handleSubmitReview}
                                  >
                                    ОТПРАВИТЬ ОТЗЫВ
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              size="sm"
                              onClick={() => addToCart(product)}
                              className="bg-primary hover:bg-primary/80"
                            >
                              <Icon name="Plus" size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                  </div>
                </>
              )}
              
              {filterCategory === 'juice' && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 tracking-wider border-b border-primary pb-2">
                    СОКИ
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {getFilteredProducts().map(product => (
                      <Card
                        key={product.id}
                        className="bg-card border-border overflow-hidden hover:border-primary transition-all hover:shadow-[0_0_20px_rgba(139,0,0,0.3)] group"
                      >
                        <div className="aspect-square bg-gradient-to-b from-secondary to-background flex items-center justify-center text-8xl backdrop-blur-sm">
                          {product.image}
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-2 tracking-wide">{product.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            {renderStars(Number(getAverageRating(product.id)))}
                            <span className="text-xs text-muted-foreground font-mono">
                              ({getProductReviews(product.id).length})
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-primary font-mono text-xl">{product.price} ₽</span>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => addToCart(product)}
                                className="bg-primary hover:bg-primary/80"
                              >
                                <Icon name="Plus" size={16} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {filterCategory === 'clothing' && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 tracking-wider border-b border-primary pb-2">
                    ОДЕЖДА
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {getFilteredProducts().map(product => (
                      <Card
                        key={product.id}
                        className="bg-card border-border overflow-hidden hover:border-primary transition-all hover:shadow-[0_0_20px_rgba(139,0,0,0.3)] group"
                      >
                        <div className="aspect-square bg-gradient-to-b from-secondary to-background flex items-center justify-center text-8xl backdrop-blur-sm">
                          {product.image}
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-2 tracking-wide">{product.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            {renderStars(Number(getAverageRating(product.id)))}
                            <span className="text-xs text-muted-foreground font-mono">
                              ({getProductReviews(product.id).length})
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-primary font-mono text-xl">{product.price} ₽</span>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => addToCart(product)}
                                className="bg-primary hover:bg-primary/80"
                              >
                                <Icon name="Plus" size={16} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
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
                      onClick={() => handleTrackSelect(index)}
                      className={`p-4 rounded border cursor-pointer transition-all ${
                        currentTrack === index
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon 
                          name={currentTrack === index && isPlaying ? 'Pause' : 'Play'} 
                          size={20} 
                          className="text-primary" 
                        />
                        <span className="font-mono text-sm">{track.name}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <audio ref={audioRef} />

                <div className="mb-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 pt-6 border-t border-border">
                  <Button
                    size="icon"
                    variant="outline"
                    className="border-border"
                    onClick={handlePrevTrack}
                    disabled={currentTrack === 0}
                  >
                    <Icon name="SkipBack" size={20} />
                  </Button>
                  <Button
                    size="icon"
                    className="bg-primary hover:bg-primary/80 h-12 w-12"
                    onClick={togglePlay}
                  >
                    <Icon name={isPlaying ? 'Pause' : 'Play'} size={24} />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="border-border"
                    onClick={handleNextTrack}
                    disabled={currentTrack === tracks.length - 1}
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