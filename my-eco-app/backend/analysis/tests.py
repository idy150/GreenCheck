import json
from unittest.mock import patch

from django.test import Client, TestCase

from analysis import views
from analysis.views import PageMetrics


class AnalyzeViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        views._CACHE.clear()

    @patch("analysis.views._fetch_page_metrics")
    def test_returns_computed_level(self, mock_fetch):
        mock_fetch.return_value = PageMetrics(
            page_weight_kb=900,
            request_count=50,
            image_count=8,
            large_image_count=1,
            third_party_requests=5,
            inline_script_kb=80,
        )

        response = self.client.post(
            "/analyze/",
            data=json.dumps({"url": "example.com"}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn(payload["niveau"], {"A", "B", "C", "D", "E"})
        self.assertIn("message", payload)
        self.assertIn("conseils", payload)
        self.assertEqual(payload["diagnostic"]["image_count"], 8)
        self.assertIn("inline_script_kb", payload["diagnostic"])

    def test_missing_url_returns_error(self):
        response = self.client.post(
            "/analyze/",
            data=json.dumps({"url": ""}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.json())

    @patch("analysis.views._fetch_page_metrics")
    def test_cache_is_used_between_calls(self, mock_fetch):
        mock_fetch.return_value = PageMetrics(
            page_weight_kb=500,
            request_count=30,
            image_count=5,
            large_image_count=0,
            third_party_requests=2,
            inline_script_kb=10,
        )

        for _ in range(2):
            self.client.post(
                "/analyze/",
                data=json.dumps({"url": "example.com"}),
                content_type="application/json",
            )

        self.assertEqual(mock_fetch.call_count, 1)
