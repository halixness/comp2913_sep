package the.edgy.data.network;

import org.json.JSONObject;

import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;

import javax.net.ssl.HttpsURLConnection;

public class HttpManager {

    private String baseUrl;
    private String lastResponse;


    //  constructor for HttpManager class
    //
    public HttpManager(String baseUrl) {
        this.baseUrl = baseUrl;
    }


    // GET request to path with JSON payload
    //
    public String serverGet(String path, JSONObject payload) {
        return serverRequest("GET", path, payload);
    }


    // POST request to path with JSON payload
    //
    public String serverPost(String path, JSONObject payload) {
        return serverRequest("POST", path, payload);
    }


    // creates a thread to send http request
    // string from response stored as class variable returned
    //
    private String serverRequest(String method, String path, JSONObject payload) {
        Thread thread = new Thread(new HttpRestRunnable(method, path, payload));
        thread.start();
        try {
            thread.join();
        }
        catch (InterruptedException e) {
            System.out.println(e);
        }
        return lastResponse;
    }


    // class Runnable to send http request using Thread
    // (in compliance with android)
    //
    private class HttpRestRunnable implements Runnable {

        private String method;
        private String path;
        private JSONObject payload;

        // constructor
        private HttpRestRunnable(String method, String path, JSONObject payload) {
            this.method = method;
            this.path = baseUrl + "/" + path;
            this.payload = payload;
        }

        @Override
        public void run() {
            try {
                URL url = new URL(path);
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setDoOutput(true);
                connection.setRequestMethod(method);
                connection.setRequestProperty("Content-Type", "application/json");

                if (method.equals("POST")) {
                    // write json to server
                    PrintWriter out = new PrintWriter(connection.getOutputStream(), true);
                    out.println(payload.toString());
                    out.close();
                }

                // read response from server
                BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));

                int inputInt;
                StringBuilder builder = new StringBuilder();
                while ((inputInt = in.read()) != -1)
                    builder.append((char)inputInt);

                // set instance attribute to the string
                lastResponse = builder.toString();

            }
            catch (IOException e) {
                System.out.println(e);
            }
        }
    }

    public static void main (String [] args) {
        try {
            HttpManager http = new HttpManager("http://127.0.0.1:3000");
            JSONObject payload = new JSONObject();
            payload.put("test","hi");
            String res = http.serverGet("test", payload);
            System.out.println(res);
        }
        catch (org.json.JSONException e) {
            System.out.println(e);
        }
    }
}
