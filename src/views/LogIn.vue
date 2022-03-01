<template>
    <div class="page-log-in">
        <div class="columns">
            <div class="column is-4 is-offset-4">
                <h1 class="title">Log in</h1>

                <form @submit.prevent="submitForm">
                    <div class="field">
                        <label>Email</label>
                        <div class="control">
                            <input type="text" class="input" v-model="email">
                        </div>
                    </div>

                    <div class="field">
                        <label>Password</label>
                        <div class="control">
                            <input type="password" class="input" v-model="password">
                        </div>
                    </div>

                    <div class="notification is-danger" v-if="errors.length">
                        <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
                    </div>

                    <div class="field">
                        <div class="control">
                            <button class="button is-dark">Log in</button>
                        </div>
                    </div>

                    <hr>

                    Or <router-link to="/sign-up">click here</router-link> to sign up!
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'LogIn',
    data() {
        return {
            email: '',
            password: '',
            errors: []
        }
    },
    mounted() {
        document.title = 'Log In | Djackets'
    },
    methods: {
        async submitForm() {
            const formData = {
                email: this.email,
                password: this.password
            }

            await axios
                .post("/api/login/", formData)
                .then(response => {
                    const token = response.data.jwt
                    var tomorrow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000));
                    document.cookie = `jwt=${token}; expires=${tomorrow}; secure=true`;
                    console.log(this.$route.query.to)
                    var toPath = this.$route.query.to
                    this.$route.push(toPath)
                })
                .catch(error => {
                    if (error.response) {
                        for (const property in error.response.data) {
                            this.errors.push(`${property}: ${error.response.data[property]}`)
                        }
                    } else {
                        this.errors.push(error.response)
                        
                        console.log(JSON.stringify(error))
                    }
                })
        }
    }
}
</script>