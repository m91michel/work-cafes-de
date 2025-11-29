"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Cafe } from "@/libs/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Paths from "@/libs/paths";
import { Form } from "@/components/ui/form";
import { MyTextarea } from "@/components/general/form/inputs/textarea-input";
import { useToast } from "@/hooks/use-toast";

interface CafeEditFormProps {
  cafe: Cafe;
}

interface FormInputs {
  about_de: string;
  about_en: string;
  food_de: string;
  food_en: string;
  drinks_de: string;
  drinks_en: string;
  work_friendly_de: string;
  work_friendly_en: string;
  open_hours: string;
  links_text: string;
  discard_reason: string;
  error_message: string;
}

export function CafeEditForm({ cafe }: CafeEditFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Only language tabs are managed by useState
  const [aboutTab, setAboutTab] = useState<"de" | "en">("de");
  const [foodTab, setFoodTab] = useState<"de" | "en">("de");
  const [drinksTab, setDrinksTab] = useState<"de" | "en">("de");
  const [workFriendlyTab, setWorkFriendlyTab] = useState<"de" | "en">("de");

  // Parse content JSON objects for default values
  const aboutContent = (cafe.about_content as { de?: string; en?: string } | null) || {};
  const foodContent = (cafe.food_contents as { de?: string; en?: string } | null) || {};
  const drinksContent = (cafe.drinks_content as { de?: string; en?: string } | null) || {};
  const workFriendlyContent = (cafe.work_friendly_content as { de?: string; en?: string } | null) || {};

  const form = useForm<FormInputs>({
    defaultValues: {
      about_de: aboutContent.de || "",
      about_en: aboutContent.en || "",
      food_de: foodContent.de || "",
      food_en: foodContent.en || "",
      drinks_de: drinksContent.de || "",
      drinks_en: drinksContent.en || "",
      work_friendly_de: workFriendlyContent.de || "",
      work_friendly_en: workFriendlyContent.en || "",
      open_hours: cafe.open_hours || "",
      links_text: cafe.links_text || "",
      discard_reason: cafe.discard_reason || "",
      error_message: cafe.error_message || "",
    },
  });

  const onSubmit = async (data: FormInputs) => {
    setIsLoading(true);
    setError(null);

    try {
      // Construct nested objects with language versions in submit handler
      const response = await fetch(`/api/cafes/edit/${cafe.slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          about_content: {
            de: data.about_de,
            en: data.about_en,
          },
          food_contents: {
            de: data.food_de,
            en: data.food_en,
          },
          drinks_content: {
            de: data.drinks_de,
            en: data.drinks_en,
          },
          work_friendly_content: {
            de: data.work_friendly_de,
            en: data.work_friendly_en,
          },
          open_hours: data.open_hours || null,
          links_text: data.links_text || null,
          discard_reason: data.discard_reason || null,
          error_message: data.error_message || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update cafe");
      }

      toast({
        title: "Success",
        description: "Cafe updated successfully",
      });

      // Redirect back to cafe page
      router.push(Paths.cafe(cafe.slug));
      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>About Content</CardTitle>
            <CardDescription>
              Edit the about content for this cafe. Use the tabs to switch between German and English.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={aboutTab} onValueChange={(value) => setAboutTab(value as "de" | "en")}>
              <TabsList>
                <TabsTrigger value="de">German (DE)</TabsTrigger>
                <TabsTrigger value="en">English (EN)</TabsTrigger>
              </TabsList>
              <TabsContent value="de" className="mt-4">
                <MyTextarea
                  form={form}
                  name="about_de"
                  label="About (German)"
                  placeholder="Enter the German description of the cafe..."
                  rows={10}
                />
              </TabsContent>
              <TabsContent value="en" className="mt-4">
                <MyTextarea
                  form={form}
                  name="about_en"
                  label="About (English)"
                  placeholder="Enter the English description of the cafe..."
                  rows={10}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Food Content</CardTitle>
            <CardDescription>
              Edit the food content for this cafe. Use the tabs to switch between German and English.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={foodTab} onValueChange={(value) => setFoodTab(value as "de" | "en")}>
              <TabsList>
                <TabsTrigger value="de">German (DE)</TabsTrigger>
                <TabsTrigger value="en">English (EN)</TabsTrigger>
              </TabsList>
              <TabsContent value="de" className="mt-4">
                <MyTextarea
                  form={form}
                  name="food_de"
                  label="Food (German)"
                  placeholder="Enter the German food description..."
                  rows={10}
                />
              </TabsContent>
              <TabsContent value="en" className="mt-4">
                <MyTextarea
                  form={form}
                  name="food_en"
                  label="Food (English)"
                  placeholder="Enter the English food description..."
                  rows={10}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Drinks Content</CardTitle>
            <CardDescription>
              Edit the drinks content for this cafe. Use the tabs to switch between German and English.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={drinksTab} onValueChange={(value) => setDrinksTab(value as "de" | "en")}>
              <TabsList>
                <TabsTrigger value="de">German (DE)</TabsTrigger>
                <TabsTrigger value="en">English (EN)</TabsTrigger>
              </TabsList>
              <TabsContent value="de" className="mt-4">
                <MyTextarea
                  form={form}
                  name="drinks_de"
                  label="Drinks (German)"
                  placeholder="Enter the German drinks description..."
                  rows={10}
                />
              </TabsContent>
              <TabsContent value="en" className="mt-4">
                <MyTextarea
                  form={form}
                  name="drinks_en"
                  label="Drinks (English)"
                  placeholder="Enter the English drinks description..."
                  rows={10}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Work-Friendly Content</CardTitle>
            <CardDescription>
              Edit the work-friendly content (laptop-friendly information) for this cafe. Use the tabs to switch between German and English.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={workFriendlyTab} onValueChange={(value) => setWorkFriendlyTab(value as "de" | "en")}>
              <TabsList>
                <TabsTrigger value="de">German (DE)</TabsTrigger>
                <TabsTrigger value="en">English (EN)</TabsTrigger>
              </TabsList>
              <TabsContent value="de" className="mt-4">
                <MyTextarea
                  form={form}
                  name="work_friendly_de"
                  label="Work-Friendly (German)"
                  placeholder="Enter the German work-friendly description (e.g., WLAN, power outlets)..."
                  rows={10}
                />
              </TabsContent>
              <TabsContent value="en" className="mt-4">
                <MyTextarea
                  form={form}
                  name="work_friendly_en"
                  label="Work-Friendly (English)"
                  placeholder="Enter the English work-friendly description (e.g., WiFi, power outlets)..."
                  rows={10}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Opening Hours</CardTitle>
            <CardDescription>
              Edit the opening hours. Each line represents a day or time period.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MyTextarea
              form={form}
              name="open_hours"
              label="Opening Hours"
              placeholder="Monday: 09:00 - 18:00
Tuesday: 09:00 - 18:00
..."
              rows={8}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Links</CardTitle>
            <CardDescription>
              Edit the links for this cafe. Enter URLs separated by spaces or newlines.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MyTextarea
              form={form}
              name="links_text"
              label="Links"
              placeholder="https://instagram.com/cafe
https://facebook.com/cafe
..."
              rows={6}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin Options</CardTitle>
            <CardDescription>
              Administrative fields for managing cafe status and errors.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <MyTextarea
              form={form}
              name="discard_reason"
              label="Discard Reason"
              placeholder="Reason for discarding this cafe..."
              rows={3}
            />
            <MyTextarea
              form={form}
              name="error_message"
              label="Error Message"
              placeholder="Error message if any..."
              rows={3}
            />
          </CardContent>
        </Card>

        {error && (
          <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
