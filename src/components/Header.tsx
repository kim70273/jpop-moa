'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from 'next/link';

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
            JPOP-MOA
          </Link>
        </Typography>
        <Box>
          <Button color="inherit" component={Link} href="/">
            홈
          </Button>
          <Button color="inherit" component={Link} href="/jpop-news">
            J-POP 뉴스
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
