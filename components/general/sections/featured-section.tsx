"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { domainDe, domainEn } from "@/config/config";

interface EmbedCodeProps {
  theme: "light" | "neutral" | "dark";
  domain: string;
  cafeName?: string;
}

const getEmbedCode = ({ theme, domain, cafeName = "" }: EmbedCodeProps) => {
  const encodedCafeName = encodeURIComponent(cafeName);
  const cafeParam = cafeName ? `&cafe=${encodedCafeName}` : "";
  
  return `<a href="https://${domain}/featured?ref=badge${cafeParam}" 
  style="display:inline-flex;align-items:center;height:40px;padding:0 10px;background-color:${theme === 'light' ? '#f9fafb' : theme === 'neutral' ? '#f3f4f6' : '#1f2937'};color:${theme === 'dark' ? '#f9fafb' : '#1f2937'};text-decoration:none;font-family:system-ui,-apple-system,sans-serif;font-size:14px;border-radius:6px;border:1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'};">
  <span style="display:flex;align-items:center;margin-right:8px;">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:${theme === 'dark' ? '#a78bfa' : '#8b5cf6'};margin-right:6px;">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
    <span style="font-weight:500;">FEATURED ON</span>
  </span>
  <span style="font-weight:600;color:${theme === 'dark' ? '#a78bfa' : '#8b5cf6'};">${domain}</span>
</a>`;
};

export function FeaturedSection() {
  const { t } = useTranslation("featured");
  const [theme, setTheme] = useState<"light" | "neutral" | "dark">("light");
  const [domain, setDomain] = useState<string>(domainEn);
  const [cafeName, setCafeName] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const embedCode = getEmbedCode({ theme, domain, cafeName });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast({
      title: t("copied"),
      description: t("copiedDescription"),
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-12 px-4 md:px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2">{t("title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        <Card className="p-6">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">{t("customize")}</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t("theme")}</label>
                    <Tabs value={theme} onValueChange={(value) => setTheme(value as any)} className="w-full">
                      <TabsList className="grid grid-cols-3 w-full">
                        <TabsTrigger value="light">Light</TabsTrigger>
                        <TabsTrigger value="neutral">Neutral</TabsTrigger>
                        <TabsTrigger value="dark">Dark</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">{t("domain")}</label>
                    <Tabs value={domain} onValueChange={(value) => setDomain(value as any)} className="w-full">
                      <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value={domainEn}>{domainEn}</TabsTrigger>
                        <TabsTrigger value={domainDe}>{domainDe}</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  
                  <div>
                    <label htmlFor="cafe-name" className="block text-sm font-medium mb-1">
                      {t("cafeName")}
                    </label>
                    <input
                      id="cafe-name"
                      type="text"
                      value={cafeName}
                      onChange={(e) => setCafeName(e.target.value)}
                      placeholder={t("cafeNamePlaceholder")}
                      className="w-full px-3 py-2 border border-input rounded-md"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col">
                <h3 className="text-lg font-medium mb-2">{t("preview")}</h3>
                <div className={`flex items-center justify-center flex-1 rounded-lg p-6 ${
                  theme === "light" ? "bg-white" : 
                  theme === "neutral" ? "bg-gray-100" : 
                  "bg-gray-800"
                }`}>
                  <div dangerouslySetInnerHTML={{ __html: embedCode }} />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">{t("embedCode")}</h3>
              <div className="relative">
                <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
                  <code>{embedCode}</code>
                </pre>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="absolute top-2 right-2"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>
                <strong>{t("installation").split(":")[0]}:</strong> {t("installation").split(":")[1]}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

export default FeaturedSection;
