<?php

namespace App\Http\Controllers;

use App\User;
use Auth;
use App\Events\ChatEvent;
use Illuminate\Http\Request;

class chatController extends Controller
{

    public function __construct()

    {
        $this->middleware('auth');
    }
    public function send(Request $request)
    {

        $user = User::find(Auth::id());
        $this->saveToSession($request);
        event(new ChatEvent($request->message,$user));
    }

    public function saveToSession( Request $request)
    {

        session()->put('chat',$request->message);

    }
    public function getOldMessage()
    {
        return session('chat');
    }
}
