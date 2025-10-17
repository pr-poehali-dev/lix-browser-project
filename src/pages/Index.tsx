import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

declare global {
  interface Window {
    google: any;
  }
}

interface SearchHistoryItem {
  id: number;
  query: string;
  search_time: string;
  results_count: number;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cse.google.com/cse.js?cx=22a36662e928143f6';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch('https://functions.poehali.dev/df49ffc9-9971-4a59-a203-b37fc6f6cdc3?limit=5');
      const data = await response.json();
      setSearchHistory(data.history || []);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const saveSearch = async (query: string) => {
    try {
      await fetch('https://functions.poehali.dev/df49ffc9-9971-4a59-a203-b37fc6f6cdc3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      loadSearchHistory();
    } catch (error) {
      console.error('Failed to save search:', error);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Icon name="Globe" size={48} className="text-primary" />
                <h1 className="text-5xl font-bold text-foreground">Lix Browser</h1>
              </div>
              <p className="text-xl text-muted-foreground">Ваш умный поисковик в темной теме</p>
            </div>
            
            {searchHistory.length > 0 && (
              <Card className="w-full max-w-2xl p-6 bg-card border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Icon name="Clock" size={20} className="text-primary" />
                    Последние поиски
                  </h3>
                  <Badge variant="secondary">{searchHistory.length}</Badge>
                </div>
                <div className="space-y-2">
                  {searchHistory.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                      onClick={() => {
                        setActiveSection('search');
                        setTimeout(() => saveSearch(item.query), 100);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Icon name="Search" size={16} className="text-muted-foreground" />
                        <span className="text-foreground">{item.query}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(item.search_time).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        );
      
      case 'search':
        return (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="text-center space-y-2 mb-8">
              <Icon name="Search" size={40} className="text-primary mx-auto" />
              <h2 className="text-3xl font-bold text-foreground">Поиск</h2>
              <p className="text-muted-foreground">Найдите всё, что нужно</p>
            </div>
            <Card className="p-6 bg-card border-border">
              <div className="gcse-search"></div>
            </Card>
            
            {searchHistory.length > 0 && (
              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Icon name="History" size={20} className="text-primary" />
                  История поиска
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {searchHistory.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 p-2 rounded bg-muted/50 hover:bg-muted transition-colors cursor-pointer text-sm"
                    >
                      <Icon name="Search" size={14} className="text-muted-foreground" />
                      <span className="text-foreground truncate">{item.query}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        );
      
      case 'settings':
        return (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="text-center space-y-2 mb-8">
              <Icon name="Settings" size={40} className="text-primary mx-auto" />
              <h2 className="text-3xl font-bold text-foreground">Настройки</h2>
            </div>
            <Card className="p-6 bg-card border-border space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium text-foreground">Темная тема</h3>
                  <p className="text-sm text-muted-foreground">Включена по умолчанию</p>
                </div>
                <div className="w-12 h-6 bg-primary rounded-full flex items-center justify-end px-1">
                  <div className="w-4 h-4 bg-background rounded-full"></div>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium text-foreground">Безопасный поиск</h3>
                  <p className="text-sm text-muted-foreground">Фильтрация контента</p>
                </div>
                <div className="w-12 h-6 bg-primary rounded-full flex items-center justify-end px-1">
                  <div className="w-4 h-4 bg-background rounded-full"></div>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium text-foreground">История поиска</h3>
                  <p className="text-sm text-muted-foreground">Сохранять запросы</p>
                </div>
                <div className="w-12 h-6 bg-muted rounded-full flex items-center px-1">
                  <div className="w-4 h-4 bg-background rounded-full"></div>
                </div>
              </div>
            </Card>
          </div>
        );
      
      case 'about':
        return (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="text-center space-y-2 mb-8">
              <Icon name="Info" size={40} className="text-primary mx-auto" />
              <h2 className="text-3xl font-bold text-foreground">О проекте</h2>
            </div>
            <Card className="p-8 bg-card border-border space-y-6">
              <div className="flex items-center gap-4">
                <Icon name="Globe" size={48} className="text-primary" />
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Lix Browser</h3>
                  <p className="text-muted-foreground">Версия 1.0.0</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-4 text-foreground">
                <p>
                  Lix Browser — современный поисковик с темной темой, созданный для комфортной работы в любое время суток.
                </p>
                <p>
                  Мы используем технологию Google Custom Search для быстрого и точного поиска информации в интернете.
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Возможности:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-primary" />
                    Быстрый поиск
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-primary" />
                    Темная тема для глаз
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-primary" />
                    Минималистичный интерфейс
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-primary" />
                    Google Custom Search
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Globe" size={28} className="text-primary" />
              <span className="text-xl font-bold text-foreground">Lix Browser</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={activeSection === 'home' ? 'default' : 'ghost'}
                onClick={() => setActiveSection('home')}
                className="gap-2"
              >
                <Icon name="Home" size={18} />
                Главная
              </Button>
              <Button
                variant={activeSection === 'search' ? 'default' : 'ghost'}
                onClick={() => setActiveSection('search')}
                className="gap-2"
              >
                <Icon name="Search" size={18} />
                Поиск
              </Button>
              <Button
                variant={activeSection === 'settings' ? 'default' : 'ghost'}
                onClick={() => setActiveSection('settings')}
                className="gap-2"
              >
                <Icon name="Settings" size={18} />
                Настройки
              </Button>
              <Button
                variant={activeSection === 'about' ? 'default' : 'ghost'}
                onClick={() => setActiveSection('about')}
                className="gap-2"
              >
                <Icon name="Info" size={18} />
                О проекте
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        {renderSection()}
      </main>

      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Icon name="Globe" size={20} className="text-primary" />
            <span>Lix Browser © 2024</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;