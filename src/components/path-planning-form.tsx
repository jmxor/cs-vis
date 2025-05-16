import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  timeoutMS: z.coerce.number().min(100).max(5000),
  goalBiasEnabled: z.boolean(),
  goalBias: z.coerce.number().min(0).max(1),
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
      timeoutMS: 1000,
      goalBiasEnabled: false,
      goalBias: 0.6,
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

        <FormField
          control={form.control}
          name="timeoutMS"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timeout</FormLabel>
              <FormControl>
                <div className="flex">
                  <Input
                    type="number"
                    className="rounded-r-none"
                    {...field}
                    min={100}
                    max={5000}
                  />
                  <div className="h-9 px-3 py-1 border border-l-0 rounded-r-lg">
                    ms
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="goalBias"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel className="mb-0">Goal Bias</FormLabel>
                <FormField
                  control={form.control}
                  name="goalBiasEnabled"
                  render={({ field }) => (
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  )}
                />
              </div>
              <FormControl>
                <Input type="number" {...field} min={0} max={1} step={0.01} />
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
