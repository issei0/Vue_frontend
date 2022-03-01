<template>
    <div class="page-checkout">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Checkout</h1>
            </div>

            <div class="column is-12 box">
                <table class="table is-fullwidth">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr
                            v-for="item in cart.items"
                            v-bind:key="item.product.id"
                        >
                            <td>{{ item.product.name }}</td>
                            <td>${{ item.product.price }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>${{ getItemTotal(item).toFixed(2) }}</td>
                        </tr>
                    </tbody>

                    <tfoot>
                        <tr>
                            <td colspan="2">Total</td>
                            <td>{{ cartTotalLength }}</td>
                            <td>${{ cartTotalPrice.toFixed(2) }}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div class="column is-12 box">
                <h2 class="subtitle">Shipping details</h2>

                <p class="has-text-grey mb-4">* All fields are required</p>

                <div class="columns is-multiline">
                    <div class="column is-6">
                        <div class="field">
                            <label>Address*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="address">
                            </div>
                        </div>

                        <div class="field">
                            <label>Zip code*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="zipcode">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="notification is-danger mt-4" v-if="errors.length">
                    <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
                </div>

                <hr>

                <div id="card-element" class="mb-5"></div>

                <template v-if="cartTotalLength">
                    <hr>

                    <button class="button is-dark" @click="submitForm">Pay with Stripe</button>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import Mixins from '@/Mixins'
import totalLength from '@/App'

export default {
    name: 'Checkout',
    data() {
        return {
            cart: {
                items: []
            },
            address: '',
            zipcode: '',
            errors: []
        }
    },
    mounted() {
        document.title = 'Checkout | Djackets'

        this.cart = this.$store.state.cart
        // if (this.cartTotalLength > 0) {
            //     this.stripe = Stripe('pk_test_51H1HiuKBJV2qfWbD2gQe6aqanfw6Eyul5PO2KeOuSRlUMuaV4TxEtaQyzr9DbLITSZweL7XjK3p74swcGYrE2qEX00Hz7GmhMI')
        //     const elements = this.stripe.elements();
        //     this.card = elements.create('card', { hidePostalCode: true })

        //     this.card.mount('#card-element')
        // }
    },
    methods: {
        getItemTotal(item) {
            return item.quantity * item.product.price
        },
        submitForm() {
            this.errors = []

            if (this.phone === '') {
                this.errors.push('The phone field is missing!')
            }

            if (this.address === '') {
                this.errors.push('The address field is missing!')
            }

            if (this.zipcode === '') {
                this.errors.push('The zip code field is missing!')
            }

            // store first_name, last_name, email, username

            // if (!this.errors.length) {
                //     this.$store.commit('setIsLoading', true)

            //     this.stripe.createToken(this.card).then(result => {                    
                //         if (result.error) {
                    //             this.$store.commit('setIsLoading', false)

            //             this.errors.push('Something went wrong with Stripe. Please try again')

            //             console.log(result.error.message)
            //         } else {
                //             this.stripeTokenHandler(result.token)
            //         }
            //     })
            // }
        // },
        // async stripeTokenHandler(token) {
            const items = []

            for (let i = 0; i < this.cart.items.length; i++) {
                const item = this.cart.items[i]
                const obj = {
                    product: item.product.id,
                    quantity: item.quantity,
                    price: item.product.price * item.quantity
                }

                items.push(obj)
            }

            const dat = {
                'address': this.address,
                'zipcode': this.zipcode,
                'items': items,
            }

            // await 
            let cooki = Mixins.methods.readCookie();
            axios.request({
                url: '/api/checkout/',
                method: "post",
                data: dat,
                headers:{'Authorization': `${cooki}`}
            }).then(response => {
                    cooki = "";
                    this.$store.commit('clearCart')
                    this.$router.push('/cart/success')
                    console.log(response.data)
                })
                .catch(error => {
                    this.errors.push("Your are not logged in or the login session expired")
                })

                this.$store.commit('setIsLoading', false)
            // axios
            //     .post('/api/checkout/', data)
            //     .then(response => {
            //         this.$store.commit('clearCart')
            //         this.$router.push('/cart/success')
            //         console.log(response)
            //     })
            //     .catch(error => {
            //         this.errors.push('Something went wrong. Please try again')

            //         console.log(error)
            //     })

            //     this.$store.commit('setIsLoading', false)
        }
    },
    computed: {
        cartTotalPrice() {
            return this.cart.items.reduce((acc, curVal) => {
                return acc += curVal.product.price * curVal.quantity
            }, 0)
        },
        cartTotalLength() {
            return this.cart.items.reduce((acc, curVal) => {
                return acc += curVal.quantity
            }, 0)
        },
    }
}
</script>