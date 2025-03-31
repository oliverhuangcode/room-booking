import { simpleParser } from 'mailparser';

export const config = {
  runtime: 'nodejs',
};

export async function POST(request: Request) {
  try {
    // Read the raw email text from the request body
    const rawEmail = await request.text();

    // Parse the email content using mailparser
    const parsed = await simpleParser(rawEmail);
    const textBody: string = parsed.text || '';
    console.log(textBody)

    // Example regex: adjust based on your email format.
    // This expects a line like: "Room: LG-01, Date: April 3, 2025, Time: 12:30am - 1:30am"
    const bookingRegex = /Room:\s*(?<room>\S+),\s*Date:\s*(?<date>.+?),\s*Time:\s*(?<time>.+)/;
    const match = bookingRegex.exec(textBody);

    if (match && match.groups) {
      const { room, date, time } = match.groups;
      console.log('Booking Details:', { room, date, time });

      return new Response(
        JSON.stringify({
          message: 'Email parsed and booking recorded',
          data: { room, date, time },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ message: 'Unable to parse booking details' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
