<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

/**
 * Response API
 */
class ResponseApi extends JsonResponse
{
  protected string $message;
  protected string $title;
  protected mixed $data = [];

  function __construct()
  {
    $this->message = 'OK';
    $this->title = 'Response Title';

    parent::__construct();
  }

  public function message(string $message)
  {
    $this->message = $message;
    return $this->synchronizeData();
  }

  public function getMessage()
  {
    return $this->message;
  }

  public function title(string $title)
  {
    $this->title = $title;
    return $this->synchronizeData();
  }

  public function getTitle()
  {
    return $this->title;
  }

  public function data(mixed $data)
  {
    $this->data = $data;
    return $this->synchronizeData();
  }

  public function getOriginData()
  {
    return $this->data;
  }

  public function error(string $error)
  {
    return parent::setData([
      'title' => $this->getTitle(),
      'message' => $error,
    ]);
  }

  public function formError(mixed $formError)
  {
    return parent::setData([
      'message' => $this->getMessage(),
      'title' => $this->getTitle(),
      'formError' => $formError
    ]);
  }

  protected function synchronizeData(): static
  {
    $response = parent::setData([
      'message' => $this->getMessage(),
      'title' => $this->getTitle(),
      'data' => $this->getOriginData()
    ]);

    if (!$this->getOriginData()) {
      unset($response['data']);
    };

    return $response;
  }

  public function statusCode(int $code): static
  {
    return $this->setStatusCode($code);
  }

  public function setHeader(array $headers): static
  {
    $header = array_merge(['Access-Control-Allow-Origin' => '*'], $headers);
    return $this->withHeaders($header);
  }
}
