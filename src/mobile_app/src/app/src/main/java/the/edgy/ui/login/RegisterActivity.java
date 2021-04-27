package the.edgy.ui.login;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONObject;

import the.edgy.R;
import the.edgy.data.network.HttpManager;

public class RegisterActivity extends AppCompatActivity {

    private HttpManager httpManager = new HttpManager("http://10.0.2.2:3000");

    private EditText nameField;
    private EditText surnameField;
    private EditText emailField;
    private EditText passwordField;
    private EditText confirmPasswordField;
    private EditText phoneField;
    private EditText address1Field;
    private EditText address2Field;
    private EditText zipcodeField;
    private EditText cityField;
    private EditText birthField;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.register_page);

        nameField = findViewById(R.id.name);
        surnameField = findViewById(R.id.surname);
        emailField = findViewById(R.id.email);
        passwordField = findViewById(R.id.password_register);
        confirmPasswordField = findViewById(R.id.confirm_password);
        phoneField = findViewById(R.id.phone_number);
        address1Field = findViewById(R.id.address_1);
        address2Field = findViewById(R.id.address_2);
        zipcodeField = findViewById(R.id.postal_code);
        cityField = findViewById(R.id.city);
        birthField = findViewById(R.id.date_of_birth);

        // TEST DATA - REMOVE IN FINAL PRODUCT
        //
        ((TextView)nameField).setText("test_data");
        ((TextView)surnameField).setText("test_data");
        ((TextView)emailField).setText("test_data@test.com");
        ((TextView)passwordField).setText("test_data");
        ((TextView)confirmPasswordField).setText("test_data");
        ((TextView)phoneField).setText("07777777777");
        ((TextView)address1Field).setText("test_data");
        ((TextView)address2Field).setText("test_data");
        ((TextView)zipcodeField).setText("LS2 9JT");
        ((TextView)cityField).setText("test_data");
        ((TextView)birthField).setText("01-01-1990");
        //
        // END OF TEST DATA
    }

    public void backToLogin(View v) {
        finish();
    }

    public void register(View v) {

        String res = "";

        String name = nameField.getText().toString();
        String surname = surnameField.getText().toString();
        String email = emailField.getText().toString();
        String password= passwordField.getText().toString();
        String confirmPassword = confirmPasswordField.getText().toString();
        String phone = phoneField.getText().toString();
        String address1 = address1Field.getText().toString();
        String address2 = address2Field.getText().toString();
        String zipcode = zipcodeField.getText().toString();
        String city = cityField.getText().toString();
        String birth = birthField.getText().toString();

        JSONObject payload = new JSONObject();
        try {
            payload.put("name", name);
            payload.put("surname", surname);
            payload.put("email", email);
            payload.put("password", password);
            payload.put("confirm_password", confirmPassword);
            payload.put("phone", phone);
            payload.put("address_1", address1);
            payload.put("address_2", address2);
            payload.put("zipcode", zipcode);
            payload.put("city", city);
            payload.put("birth", birth);
            res = httpManager.serverPost("api/register", payload);
        }
        catch (org.json.JSONException e) {
            System.out.println(e);
        }

        // This is for debugging. Should output whatever you input in the name field.
        Toast.makeText(getApplicationContext(), res, Toast.LENGTH_SHORT).show();
    }
}
