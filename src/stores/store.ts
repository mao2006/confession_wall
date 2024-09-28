import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const login_store = defineStore('login', 
  {
    state:()=>({
      login_status:false,
    }),
    actions: {
        reset() {
            this.$reset();
        }
    },
    persist:true,
  },
)

export const user_store = defineStore(
  'user_message',
  {
    state:()=>({
      token:'',
    }),
    actions: {
        reset() {
            this.$reset();
        }
    },
    persist:true,
  },
)