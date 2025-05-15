import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const pathPlanningFormSchema = z.object({
  algorithm: z.enum(['RRT', 'RRT*']),
  stepSize: z.coerce.number().min(8).max(32),
});

export default function PathPlanningForm({
  planners,
  onSubmit,
}: {
  planners: string[];
  onSubmit: (values: z.infer<typeof pathPlanningFormSchema>) => void;
}) {
  const form = useForm<z.infer<typeof pathPlanningFormSchema>>({
    resolver: zodResolver(pathPlanningFormSchema),
    defaultValues: {
      algorithm: 'RRT',
      stepSize: 16,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="gap-4 grid grid-cols-2">
        <FormField
          control={form.control}
          name="algorithm"
          render={({ field }) => (
            <FormItem className="mb-auto">
              <FormLabel>Algorithm</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an algorithm" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {planners.map(planner => (
                    <SelectItem key={planner} value={planner}>
                      {planner}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stepSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Step Size</FormLabel>
              <FormControl>
                <Input type="number" {...field} min={8} max={32} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="col-span-2">
          Generate
        </Button>
      </form>
    </Form>
  );
}
