"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { userAuthSchema } from "@/app/ZodSchemas/userAuthSchema";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const [formSubmitLoading, setFormSubmitLoading] = useState<boolean>(false);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof userAuthSchema>>({
    resolver: zodResolver(userAuthSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof userAuthSchema>) {
    setFormSubmitLoading(true);

    try {
      const response = await axios.post("/api/signup", values);

      if (!response.data.success) {
        toast({
          description: response.data.message,
        });
      } else {
        toast({
          title: "Success",
          description: response.data.message,
          duration: 3000,
        });

        router.replace(`/signin`);
      }
    } catch (error) {
      console.log("error to submit form", error);
      const axiosErr = error as AxiosError<any>;
      toast({
        title: "Failed",
        description: axiosErr.response?.data.message || "An error occurred",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setFormSubmitLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="border p-10 rounded-lg w-full max-w-lg bg-slate-100 shadow-md">
        <div className="text-center mb-3">
          <h1 className="text-4xl font-bold">Todo - Signup</h1>
          <p className="mt-2 text-xs">It takes less then a minute.</p>
        </div>
        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={formSubmitLoading}>
                {formSubmitLoading ? (
                  <span className="flex gap-2 justify-center items-center">
                    <Loader2 className="h-4 w-4 animate-spin" />{" "}
                    <span>Please Wait</span>
                  </span>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </div>

        <div className="text-center mt-5">
          <p className="text-xs">
            Already have an account?{" "}
            <Link href="/signin">
              {" "}
              <span className="text-blue-400">Login</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
