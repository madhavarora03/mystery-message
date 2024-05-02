'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useToast } from '@/components/ui/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import * as z from 'zod';

export default function VerifyPage() {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const res = await axios.post<ApiResponse>('/api/verify-code', {
        username: params.username,
        code: data.code,
      });

      toast({
        title: 'Success!',
        description: res.data.message,
      });

      router.replace('/signin');
    } catch (error) {
      console.error('Error during verifying code:', error);

      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: 'Sign Up Failed',
        description: axiosError.response?.data.message,
        variant: 'destructive',
      });
    }
  };
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
            Verify Your Account
          </h1>
          <p className='mb-4'>Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              name='code'
              control={form.control}
              render={({ field }) => (
                <FormItem className='flex flex-col w-full items-center justify-center'>
                  <FormLabel>Enter Verification Code</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='w-full flex items-center justify-center'>
              <Button type='submit'>Verify</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
