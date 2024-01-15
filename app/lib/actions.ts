'use server';
// By adding the 'use server', you mark all the exported functions within the file as server functions. These server functions can then be imported into Client and Server components, making them extremely versatile.
// You can also write Server Actions directly inside Server Components by adding "use server" inside the action. But for this course, we'll keep them all organized in a separate file.

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// const FormSchema = z.object({
//     id: z.string(),
//     customerId: z.string(),
//     amount: z.coerce.number(),
//     status: z.enum(['pending', 'paid']),
//     date: z.string(),
// });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

// This is temporary until @types/react-dom is updated
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const CreateInvoice = FormSchema.omit({ id: true, date: true });
export async function createInvoice(prevState: State, formData: FormData) {
  // console.log(formData);

  // const rawFormData = {
  //     customerId: formData.get('customerId'),
  //     amount: formData.get('amount'),
  //     status: formData.get('status'),
  // };
  // const rawFormData = Object.fromEntries(formData.entries())
  // Test it out:
  // console.log(rawFormData)

  // const { customerId, amount, status } = CreateInvoice.parse({
  //     customerId: formData.get('customerId'),
  //     amount: formData.get('amount'),
  //     status: formData.get('status'),
  //   });

  // Validate form fields using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      // return the errors to the state
      errors: validatedFields.error.flatten().fieldErrors,
      // return a message to the state
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
  // console.log(validatedFields);

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
  } catch (error) {
    return {
      message: " Database Error: Failed to Create Invoice",
    };
  }

  // this invalidates the cache stored in the client of the page,
  // so that the next request to the specified path retrieves fresh data. 
  // revalidatePath only invalidates the cache when the included path is next visited. 
  // This means calling revalidatePath with a dynamic route segment,
  //  will not immediately trigger many revalidations at once.
  // to revalidate data after a user action (e.g. form submission). 
  // This will invalidate the Router Cache for the associated route.
  //  The invalidation only happens when the path is next visited. Like this
  revalidatePath('/dashboard/invoices');
  // this redirect the user back to the same path to load the page with fresh data from the server.
  redirect('/dashboard/invoices');
}



// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  // const { customerId, amount, status } = UpdateInvoice.parse({
  //   customerId: formData.get('customerId'),
  //   amount: formData.get('amount'),
  //   status: formData.get('status'),
  // });

  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      // return the errors to the state
      errors: validatedFields.error.flatten().fieldErrors,
      // return a message to the state
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
  console.log(validatedFields);
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
     UPDATE invoices
     SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
     WHERE id = ${id}
   `;
  } catch (error) {
    return {
      message: " Database Error: Failed to Update Invoice",
    };
  }

  //  Note how redirect is being called outside of the try/catch block. 
  // This is because redirect works by throwing an error, which would be caught by the catch block. 
  // To avoid this, you can call redirect after try/catch. 
  // redirect would only be reachable if try is successful.

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}


export async function deleteInvoice(id: string) {
  // throw new Error('Failed to Delete Invoice');

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    // Since this action is being called in the /dashboard/invoices path,
    //  you don't need to call redirect.
    //  Calling revalidatePath will trigger a new server request and re-render the table.
    revalidatePath('/dashboard/invoices');
    return { message: "Deleted Invoice" };
  } catch (error) {
    return { message: "Database Error: Failed to Delete Invoice" };
  }
}
