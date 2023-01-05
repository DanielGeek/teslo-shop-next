import { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import Cookies from 'js-cookie';

import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from "@mui/material";

import { CartContext } from '../../context/cart/CartContext';
import { ShopLayout } from "../../components/layouts";
import { CartList, OrderSummary } from "../../components/cart";
import { countries } from '../../utils';
import { useRouter } from 'next/router';

const SummaryPage = () => {

  const router = useRouter();
  const { shippingAddress, numberOfItems, createOrder } = useContext( CartContext );

  const [ isPosting, setIsPosting ] = useState(false);
  const [ errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
      if ( !Cookies.get('firstName') ) {
          router.push('/checkout/address');
      }
  }, [ router ]);

  const onCreateOrder = async() => {
      setIsPosting(true);

      const { hasError, message } = await createOrder();

    if ( hasError ) {
        setIsPosting(false);
        setErrorMessage( message );
        return;
    }

    router.replace(`/orders/${ message }`);
  }
  

  if ( !shippingAddress ) {
      return <></>;
  }

  const { firstName, lastName, address, address2 = '', city, country, phone, zip } = shippingAddress;

  return (
    <ShopLayout title='Order Summary' pageDescription={'Summary of the order'}>
      <Typography variant='h1' component='h1' >Summary of the order</Typography>

      <Grid container>
        <Grid item xs={ 12 } sm={ 7 }>
            <CartList />
        </Grid>
        <Grid item xs={ 12 } sm={ 5 }>
            <Card className='summary-card'>
              <CardContent>
                <Typography variant='h2'>Summary ({ numberOfItems } { numberOfItems === 1 ? 'product':'products' })</Typography>
                <Divider sx={{ my:1 }} />

                <Box display='flex' justifyContent='space-between'>
                  <Typography variant='subtitle1'>Delivery address</Typography>
                  <NextLink href='/checkout/address' passHref>
                    <Link underline='always'>
                      Edit
                    </Link>
                  </NextLink>
                </Box>

                <Typography>{ firstName } { lastName }</Typography>
                <Typography>{ address }{ address2 ? `, ${address2}` : '' }</Typography>
                <Typography>{ city }, { zip }</Typography>
                {/* <Typography>{ countries.find( c => c.code === country )?.name }</Typography> */}
                <Typography>{ country }</Typography>
                <Typography>{ phone }</Typography>

                <Divider sx={{ my: 1 }} />

                <Box display='flex' justifyContent='end'>
                  <NextLink href='/cart' passHref>
                    <Link underline='always'>
                      Edit
                    </Link>
                  </NextLink>
                </Box>

                <OrderSummary />

                <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                  <Button 
                      color="secondary" 
                      className="circular-btn" 
                      fullWidth
                      onClick={ onCreateOrder }
                      disabled={ isPosting }
                  >
                    Confirm order
                  </Button>

                  <Chip
                      color="error"
                      label={ errorMessage }
                      sx={{ display: errorMessage ? 'flex': 'none', mt: 2 }}
                  />
                </Box>

              </CardContent>
            </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export default SummaryPage;