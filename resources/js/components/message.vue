<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Messenger Group Chat <span class="badge badge-warning">{{  this.numberOfUsers }}</span></div>

                    <div class="card-body" style="overflow-y: scroll;height:400px;" v-chat-scroll>


                        <div><span class="badge badge-primary">{{ typing }}</span></div>
                       <ul class="list-group" v-for="v,index in chat.messages" >


                            <li class="list-group-item" :class="className" ><slot>{{v}}</slot></li>

                            <div>
                                <span class="badge badge-primary float-right"> {{ chat.user[index]  }} at {{ chat.time[index] }}</span>
                            </div>
                            <br>

                        </ul>

                    </div>
                    <input class="form-control" type="text" v-model="message" @keyup.enter="send" placeholder="Type a message....">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {

        data() {

        return{
            numberOfUsers:0,
            typing:'',
            message:'',

            chat:{
                messages:[],
                user:[],
                color:[],
                time:[],
            }
        }

    },
    watch:{

        message()
        {
            Echo.private('chat')
                .whisper('typing', {
                    name: this.message,

            });

        }

    },
    computed:{

        className(){

                return 'list-group-item-'+this.chat.color;
        }

    },

    methods:{

        send(){

            if( this.message.length != 0)
            {
            this.chat.messages.push( this.message );
            this.chat.color.push( 'success' );
            this.chat.time.push(this.getTime());
            this.chat.user.push( 'you' );

            axios.post('/send',{
                message:this.message,
                chat:this.chat

            })
            .then(response =>{
                console.log(response);

                this.message='';
            })
            .catch(error =>{
                console.log(error);
            })
            }


        },
        getTime()
        {
            let time = new Date();
            return time.getHours()+':'+time.getMinutes();

            },
        getOldMessage()
        {
            axios.post('/getOldMessage')
            .then(response => {
                console.log(response);

                if(response.data != '')
                {
                    this.chat = response.data
                }
            })
            .catch(error =>{
                console.log(error);
            });

        },
    },

        mounted() {

            //this.getOldMessage();

            Echo.private('chat')
            .listen('ChatEvent', (e) => {
                this.chat.messages.push( e.message );
                this.$toaster.success('message recived from'+"  " + e.user);
                this.chat.user.push( e.user );
                this.chat.time.push(this.getTime());

                this.chat.color.push( 'warning' );

                axios.post('/saveToSession',{

                    chat: this.chat

                })
                .then(response =>{
                    // console.log(response)

                    if(response.data != ''){
                        this.chat = response.data
                    }
                })
                .catch(error =>{
                    console.log(error);
                })
            })
            .listenForWhisper('typing', (e) => {

                if(e.name != '')
                {
                    this.typing = 'typing.....'
                }
                else{
                    this.typing = ''
                }
            })

            Echo.join(`chat`)
                .here((users) => {
                    this.numberOfUsers = users.length;
                    console.log(users);


                })
                .joining((user) => {
                    this.numberOfUsers += 1;
                    this.$toaster.success(user.name+'Your toaster success message.')
                    console.log(user);
                })
                .leaving((user) => {
                    this.numberOfUsers -= 1;
                });

        }
    }
</script>
