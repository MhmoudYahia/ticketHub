import {
  Card,
  CardContent,
  Container,
  Typography,
  CardMedia,
  
} from '@mui/material';
import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
  return (
    <Container>
      <h2 style={{ textAlign: 'center', margin: '70px', color: 'cadetblue' }}>
        Hello In Ticketing
      </h2>
      <TicketList tickets={tickets} />
    </Container>
  );
};

LandingPage.getInitialProps = async (context, client) => {
  // has access to the request comming from browser
  const { data } = await client.get('/api/tickets');
  return { tickets: data.tickets };
};
export default LandingPage;

const TicketList = ({ tickets }) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '22px',
        flexWrap: 'wrap',
      }}
    >
      {tickets.map((ticket, index) => (
        <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
          <Card key={index} sx={{ marginBottom: '10px' }}>
            <CardMedia
              component="img"
              height="140"
              image="/imgs/ticketBG.jpg"
              alt="ticket picture"
            />
            <CardContent>
              <Typography variant="h6" component="div" textAlign="center">
                 {ticket.title}
              </Typography>
              <Typography variant="body2" textAlign='center'> {ticket.price}$</Typography>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
