<?php

namespace App\Services;

use Kreait\Firebase\Factory;

class FirebaseService
{
    protected $auth;

    public function __construct()
    {
        $factory = (new Factory)->withServiceAccount('/var/www/html/react-product-app/firebase_credentials.json');
        $this->auth = $factory->createAuth();
    }
    
    /**
     * verify2FA
     *
     * @param  mixed $idToken
     * @return void
     */
    public function verify2FA($idToken)
    {
        try {
            $verifiedIdToken = $this->auth->verifyIdToken($idToken);
            return $verifiedIdToken;
        } catch (\Exception $e) {
            return null;
        }
    }
}
