<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Passport\Passport;
use Tests\TestCase;

class ProductControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    /**
     * setUp
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('passport:client', [
            '--personal' => true,
            '--name' => 'Personal Access Client',
        ]);
        $this->user = User::factory()->create();
        Passport::actingAs($this->user);
    }

    public function test_can_list_products()
    {
        Product::factory()->count(3)->create(['user_id' => $this->user->id]);

        $response = $this->getJson('/api/products');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_can_create_a_product()
    {
        $data = [
            'name' => 'Test Product',
            'description' => 'Test Description',
            'price' => 99.99,
        ];

        $response = $this->postJson('/api/products', $data);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'name' => 'Test Product',
                    'description' => 'Test Description',
                    'price' => 99.99,
                    'user_id' => $this->user->id,
                ]
            ]);

        $this->assertDatabaseHas('products', $data);
    }

    public function test_can_show_a_product()
    {
        $product = Product::factory()->create(['user_id' => $this->user->id]);

        $response = $this->getJson("/api/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'price' => $product->price,
                    'user_id' => $product->user_id,
                ]
            ]);
    }

    public function test_can_update_a_product()
    {
        $product = Product::factory()->create(['user_id' => $this->user->id]);

        $data = [
            'name' => 'Updated Product',
            'description' => 'Updated Description',
            'price' => 199.99,
        ];

        $response = $this->putJson("/api/products/{$product->id}", $data);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $product->id,
                    'name' => 'Updated Product',
                    'description' => 'Updated Description',
                    'price' => 199.99,
                    'user_id' => $product->user_id,
                ]
            ]);

        $this->assertDatabaseHas('products', $data);
    }

    public function test_can_delete_a_product()
    {
        $product = Product::factory()->create(['user_id' => $this->user->id]);

        $response = $this->deleteJson("/api/products/{$product->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }
}
