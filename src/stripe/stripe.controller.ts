import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Headers, UseGuards } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CheckoutSessionRequest } from './dto/create-stripe.dto';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { Public, User } from 'src/decorator/customeiz';
import { AuthGuard } from '@nestjs/passport';

@Controller('stripe/checkout')
export class StripeController {
  constructor(private readonly stripeService: StripeService,
  ) {

  }

  @Public()
  @Post('webhook')
  async stripeWebhookHandler(
    @Body() body: any,
    @Res() res: Response,
    @Headers('stripe-signature') sig: string,
  ) {
    return this.stripeService.handleWebhook(body, res, sig);
  }

  @UseGuards(AuthGuard('jwt'))
  @Public()
  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body() checkoutSessionRequest: CheckoutSessionRequest,
    @User() user: any,
  ) {
    
    return this.stripeService.createCheckoutSession(checkoutSessionRequest, user);
  }
}
