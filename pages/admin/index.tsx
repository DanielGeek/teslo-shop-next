import { useState, useEffect } from 'react';
import useSWR from 'swr';

import { AttachMoneyOutlined, CreditCardOffOutlined, DashboardOutlined, GroupOutlined, CategoryOutlined, ProductionQuantityLimitsOutlined, CancelPresentationOutlined, AccessTimeOutlined } from '@mui/icons-material';

import { AdminLayout } from '../../components/layouts';
import { Grid, Typography } from '@mui/material';
import { SummaryTitle } from '../../components/admin';
import { DashboardSummaryResponse } from '../../interfaces';

const DashboardPage = () => {

    const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
        refreshInterval: 30 * 1000 // 30 seconds
    });

    const [refreshIn, setRefreshIn] = useState(30);

    useEffect(() => {
        const interval = setInterval(() => {
        console.log('Tick');
        setRefreshIn( refreshIn => refreshIn > 0 ? refreshIn - 1: 30);
        }, 1000 );

        return () => clearInterval(interval);
    }, []);
    

    if ( !error && !data ) {
        return <></>
    }

    if ( error ) {
        console.log(error);
        return <Typography>Error loading information</Typography>
    }

    const {
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
        notPaidOrders,
    } = data!;
    
    return (
    <AdminLayout
        title='Dashboard'
        subTitle='General statistics'
        icon={ <DashboardOutlined />}
    >
        <Grid container spacing={2}>
            
            <SummaryTitle
                title={ numberOfOrders }
                subTitle="Total orders"
                icon={ <CreditCardOffOutlined color="secondary" sx={{ fontSize: 40 }} />}
            />

            <SummaryTitle
                title={ paidOrders }
                subTitle="Paid orders"
                icon={ <AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} />}
            />

            <SummaryTitle
                title={ notPaidOrders }
                subTitle="Pending orders"
                icon={ <CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />}
            />

            <SummaryTitle
                title={ numberOfClients }
                subTitle="Clients"
                icon={ <GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
            />

            <SummaryTitle
                title={ numberOfProducts }
                subTitle="Products"
                icon={ <CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
            />
            
            <SummaryTitle
                title={ productsWithNoInventory }
                subTitle="Without existence"
                icon={ <CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />}
            />

            <SummaryTitle
                title={ lowInventory }
                subTitle="Low inventory"
                icon={ <ProductionQuantityLimitsOutlined color="warning" sx={{ fontSize: 40 }} />}
            />

            <SummaryTitle
                title={ refreshIn }
                subTitle="Update on"
                icon={ <AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
            />
        </Grid>
    </AdminLayout>
    )
}

export default DashboardPage